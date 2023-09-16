const teamRepo = require("./teamsRepo")
const Champ_Types = ["league", "super", "cup", "hezam"]

const getTeamsOfLeague = async (leagueId) => {
    try {
        let leagueData = await getLeagueInfoById(leagueId)
        if (leagueData === -1) return -1;
        let teamsIds = await strapi.db.connection.raw(`
            select team_id  from leagues_team_links
            where league_id = ${leagueId} ;
        `);

        let teams = await Promise.all(teamsIds.rows.map(async (team) => {
            let teamData = await teamRepo.getTeamInfoById(team.team_id);
            let teamPlayers = await teamRepo.getPlayersByTeamId(team.team_id, leagueData.end_at);
            return { ...teamData, players: teamPlayers }
        }))
        return { ...leagueData, teams };
    } catch (error) {
        console.error(error);
    }
}

const getLeagueInfoById = async (leagueId) => {
    try {
        let leagueDate = await strapi.db.connection.raw(`
        select l.id , l.name , f.url , l.end_at
        from leagues l
        inner join files_related_morphs frm on frm.related_id = l.id
        inner join files f on frm.file_id = f.id
        where l.id = ${leagueId} and l.published_at is not null and frm.related_type = 'api::league.league' and frm.field = 'image';
        `)
        return leagueDate.rows.length === 1 ? leagueDate.rows[0] : -1
    } catch (error) {
        console.error(error);
    }
}

const getLeagueFullInfoById = async (leagueId) => {
    let leagueData = await strapi.db.connection.raw(`
        select l.id as leagueId, l.name  , l.start_at , l.end_at  , 
        l.description , l.type , l.state , t.name as winner_name , 
        fl.url as league_logo,
        ft.formats -> 'thumbnail' ->> 'url' as winner_logo,
        l.laws  from leagues l 
        left join leagues_champion_links lcl on lcl.league_id = l.id 
        left join files_related_morphs frml on frml.related_id = l.id
        left join files fl on frml.file_id = fl.id
        left join teams t on t.id = lcl.team_id
        left join files_related_morphs frmt on frmt.related_id = t.id
        left join files ft on frmt.file_id = ft.id
        where l.id = ${leagueId} and frml.related_type = 'api::league.league' and l.published_at is not null  and frml.field = 'image' 
        and ( frmt.related_type = 'api::team.team' or t.id is null  ); 
    `)
    return leagueData.rows.length !== 1 ? -1 : leagueData.rows[0]
}

const getLatestLeagues = async () => {
    const leaguesData = await strapi.db.connection.raw(`
    select  l.id , l.name, fb.url as logo_background  , fl.url as champ_logo
    from leagues l
    left join files_related_morphs frmb on frmb.related_id = l.id
    left join files fb on frmb.file_id = fb.id
    left join files_related_morphs frml on frml.related_id = l.id
    left join files fl on frml.file_id = fl.id 
    where frmb.related_type = 'api::league.league' and frmb.field = 'ad_image' and frml.related_type = 'api::league.league' and frml.field = 'image'
     and l.published_at is not null and (l.state = 'upcoming' or l.state = 'live' or (l.state= 'done' and l.end_at + INTERVAL '1 Month' > NOW()) );
    `)
    return leaguesData.rows
}

const getOpenToJoinLeagues = async () => {
    const leaguesData = await strapi.db.connection.raw(`
    select  l.id , l.name,  fl.url as champ_logo
    from leagues l
    left join files_related_morphs frml on frml.related_id = l.id
    left join files fl on frml.file_id = fl.id 
    where frml.related_type = 'api::league.league' and frml.field = 'image'
    and ( l.state = 'upcoming' and l.is_join_requests_open = true );
    `)
    return leaguesData.rows
}

const getAllLeagues = async (champType) => {
    let leaguesData = await strapi.db.connection.raw(`
    select l.id as leagueId, l.name  , l.start_at , l.end_at  , 
    l.description , l.type , l.state , t.name as winner_name , 
    fl.url,
    ft.formats -> 'thumbnail' ->> 'url' as winner_logo,
    l.laws  from leagues l 
    left join leagues_champion_links lcl on lcl.league_id = l.id 
    left join files_related_morphs frml on frml.related_id = l.id
    left join files fl on frml.file_id = fl.id
    left join teams t on t.id = lcl.team_id
    left join files_related_morphs frmt on frmt.related_id = t.id
    left join files ft on frmt.file_id = ft.id
    where ${Champ_Types.includes(champType) ? `l.type = '${champType}' and` : ''}
     frml.related_type = 'api::league.league' and frml.field = 'image' and published_at is not null  and ( frmt.related_type = 'api::team.team' or t.id is null)
    order by l.end_at desc , l.start_at asc
    `)
    return leaguesData.rows
}

const getLeagueSummary = async (leagueId) => {
    let league = await getLeagueInfoById(leagueId)
    if (league === -1) return -1
    let data = await strapi.db.connection.raw(`
        select data 
        from league_tables_league_links ltll 
        inner join league_tables lt on lt.id = ltll.league_table_id
        where ltll.league_id = ${leagueId};
    `)
    return data.rows.length !== 1 ? -1 : { ...league, table: JSON.parse(data.rows[0].data) }
}

const getAllStudiosOfLeague = async (leagueId) => {
    let league = await getLeagueInfoById(leagueId)
    if (league === -1) return -1
    let studiosAnalysts = await strapi.db.connection.raw(`
      select s.id as studio_id , a.name as analyst_name , a.id as analyst_id ,s.name as studio_name , s.start_at , s.url ,s.tournment_name as tournament_name
      from leagues l 
          inner join public.studios_albtwlt_links sll on sll.league_id = l.id
      inner join studios s on  s.id = sll.studio_id
      inner join analysts_studios_links asl on asl.studio_id = s.id
      inner join analysts a on a.id = asl.analyst_id
      where l.id = ${leagueId} and published_at is not null
      order by s.start_at;
    `)
    let studiosObj = {}
    studiosAnalysts.rows.forEach((analyst) => {
        if (!Object.hasOwnProperty.call(studiosObj, analyst.studio_id)) {
            studiosObj[analyst.studio_id] = {
                name: analyst.studio_name,
                id: analyst.studio_id,
                url: analyst.url,
                start_at: analyst.start_at,
                tournament_name: analyst.tournament_name,
                analysts: []
            }
        }
        studiosObj[analyst.studio_id].analysts.push({
            id: analyst.studio_id,
            name: analyst.analyst_name,
        })
    })
    let studios = []
    for (const key in studiosObj) {
        studios.push(studiosObj[key])
    }
    let res = { ...league, studios: studios }
    return res
}

const getAllMatchesOfLeague = async (leagueId) => {
    let league = await getLeagueInfoById(leagueId)
    if (league === -1) return -1
    let matches = await strapi.db.connection.raw(`
    select m.id,t1.name as team_1_name,m.team_1_score,
        f1.formats -> 'thumbnail' ->> 'url' as team_1_logo,t2.name as team_2_name,m.team_2_score,f2.formats -> 'thumbnail' ->> 'url' as team_2_logo, 
        m.state ,m.url, m.start_at,m.tournment_name as tournament_name, l.name, m.type , l.id as league_id
        from leagues l 
        inner join matches_albtwlt_links mll on l.id = mll.league_id
        inner join matches m on  m.id = mll.match_id
        inner join matches_team_1_links mt1l on m.id = mt1l.match_id
        inner join matches_team_2_links mt2l on m.id = mt2l.match_id
        inner join teams t1 on t1.id = mt1l.team_id
        inner join teams t2 on t2.id = mt2l.team_id
        inner join files_related_morphs frm1 on frm1.related_id = t1.id
        inner join files_related_morphs frm2 on frm2.related_id = t2.id
        inner join files f1 on frm1.file_id = f1.id
        inner join files f2 on frm2.file_id = f2.id
        where l.id = ${leagueId} and  l.published_at is not null and  frm1.related_type = 'api::team.team' and frm2.related_type = 'api::team.team'
        order by m.start_at;      
        `)
    return { ...league, matches: matches.rows };
}

const getLeagueStatistics = async (leagueId) => {
    let data = await strapi.db.connection.raw(`
    select name as "الاسم" , 
      sum(skaat_played) as "عدد الصكات الملعوبة" , 
    sum(skaat_winned) as "عدد الصكات المربوحة" ,
    sum(skaat_played) - sum(skaat_winned) as "عدد الصكات الخاسرة" , sum(abnat) as "الابناط" ,
    sum(akak) as "الاكك", sum(akalat) as "الأكلات" , sum(moshtary_sun) as "مشترى صن" ,
    sum(moshtary_hakam) as "مشترى حكم", sum(moshtrayat_nagha) as "مشتريات ناجحة" ,
    sum(moshtrayat_khasera) as "مشتريات خسرانة",
    sum(sra) as "سرا", sum(baloot) as "بلوت" , sum(khamsin) as "خمسين" ,
    sum("100") as "مية" , sum("400") as "أربعمية" , sum(kababit_sun_count) as "عدد الكبابيت صن" ,
    sum(kababit_hakam_count) as "عدد الكبابيت حكم"
    from (
      SELECT t.name, sum(number_of_rounds)  as skaat_played  ,sum(team_2_score) as skaat_winned ,
      sum(team_2_akak) as akak, sum(team_2_akalat) as akalat , sum(team_2_moshtary_sun) as moshtary_sun ,
      sum(team_2_moshtary_hakam) as moshtary_hakam, sum(team_2_moshtrayat_nagha) as moshtrayat_nagha , sum(team_2_moshtrayat_khasera) as moshtrayat_khasera,
      sum(team_2_sra) as sra, sum(team_2_baloot) as baloot , sum(team_2_khamsin) as khamsin ,
      sum(team_2_100) as "100" , sum(team_2_400) as "400" , sum(team_2_kababit_sun_count) as kababit_sun_count ,
      sum(team_2_kababit_hakam_count) as kababit_hakam_count, sum(team_2_abnat) as abnat 
      FROM public.matches m  
          join public.matches_team_2_links mt2l on mt2l.match_id = m.id
          join public.matches_albtwlt_links mll on mll.match_id = m.id
      join leagues l on l.id = mll.league_id
      join public.teams t on t.id = mt2l.team_id
      where l.id = ${leagueId} and l.published_at is not null
         group by (t.name)
    
      union
    
      SELECT  t.name, sum(number_of_rounds)  as skaat_played  ,sum(team_1_score) as skaat_winned ,
      sum(team_1_akak) as akak, sum(team_1_akalat) as akalat , sum(team_1_moshtary_sun) as moshtary_sun ,
      sum(team_1_moshtary_hakam) as moshtary_hakam, sum(team_1_moshtrayat_nagha) as moshtrayat_nagha , sum(team_1_moshtrayat_khasera) as moshtrayat_khasera,
      sum(team_1_sra) as sra, sum(team_1_baloot) as baloot , sum(team_1_khamsin) as khamsin ,
      sum(team_1_100) as "100" , sum(team_1_400) as "400" , sum(team_1_kababit_sun_count) as kababit_sun_count ,
      sum(team_1_kababit_hakam_count) as kababit_hakam_count, sum(team_1_abnat) as abnat 
      FROM public.matches m  
      join public.matches_team_1_links mt1l on mt1l.match_id = m.id
      join public.matches_albtwlt_links mll on mll.match_id = m.id
      join leagues l on l.id = mll.league_id
      join public.teams t on t.id = mt1l.team_id
      where l.id = ${leagueId} and l.published_at is not null
        group by (t.name)
      )as nt group by nt.name ;
    `)
    return data.rows
}
module.exports = {
    getTeamsOfLeague,
    getLeagueInfoById,
    getLatestLeagues,
    getOpenToJoinLeagues,
    getAllLeagues,
    getLeagueFullInfoById,
    getLeagueSummary,
    getAllStudiosOfLeague,
    getAllMatchesOfLeague,
    getLeagueStatistics
}
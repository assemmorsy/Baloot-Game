"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::league.league", ({ strapi }) => {
  const Champ_Types = ["league", "super", "cup"]
  return {
    async getById(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      try {
        let leagueDate = await strapi.db.connection.raw(`
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
        if (leagueDate.rows.length === 0) {
          ctx.throw(404, "League Not Found");
        }
        return { ...leagueDate.rows[0] }
      } catch (error) {
        console.error(error);
        return { error_text: "can't fetch data from db" }
      }

    },
    async get(ctx) {
      const champType = strapi.requestContext.get().query.type;
      let leagueDate = await strapi.db.connection.raw(`
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
      return { champs: [...leagueDate.rows] }
    },
    async summary(ctx) {
      let league = await this.findLeague(ctx)
      let data = await strapi.db.connection.raw(`
        select data 
        from league_tables_league_links ltll 
        inner join league_tables lt on lt.id = ltll.league_table_id
        where ltll.league_id = ${league.id};
      `)
      if (data.rows.length === 0) {
        ctx.throw(404, "League or Table Not Found");
      } else {
        let res = { ...league, table: JSON.parse(data.rows[0].data) }
        return res
      }

    },
    async findAllStudiosOfLeague(ctx) {
      let league = await this.findLeague(ctx)
      let studiosAnalysts = await strapi.db.connection.raw(
        `
        select s.id as studio_id , a.name as analyst_name , a.id as analyst_id ,s.name as studio_name , s.start_at , s.url ,s.tournment_name as tournament_name
        from leagues l 
		    inner join public.studios_albtwlt_links sll on sll.league_id = l.id
        inner join studios s on  s.id = sll.studio_id
        inner join analysts_studios_links asl on asl.studio_id = s.id
        inner join analysts a on a.id = asl.analyst_id
        where l.id = ${league.id} and published_at is not null
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
    },
    async findAllRefereesOfLeague(ctx) {
      let league = await this.findLeague(ctx)
      let referees = await strapi.db.connection.raw(`
      select distinct(r.id) , r.name  ,fr.formats -> 'thumbnail' ->> 'url' as image
      from leagues l 
      inner join matches_albtwlt_links mll on l.id = mll.league_id
      inner join matches_referees_links mrl on mrl.match_id = mll.match_id
      inner join referees r on r.id = mrl.referee_id
      inner join files_related_morphs frmr on frmr.related_id = r.id
      inner join files fr on frmr.file_id = fr.id
      where l.id = ${league.id} and l.published_at is not null and frmr.related_type = 'api::referee.referee' 
      `)
      return { ...league, referees: referees.rows }
    },
    async findAllTeamsOfLeague(ctx) {
      let leaguePlayers = await this.findAllPlayersOfLeague(ctx);
      let teamsObj = {}
      leaguePlayers.players.forEach((player) => {
        if (!Object.hasOwnProperty.call(teamsObj, player.team_id)) {
          teamsObj[player.team_id] = {
            name: player.team_name,
            id: player.team_id,
            logo: player.team_logo,
            players: []
          }
        }
        if (player.player_order === 1) {
          teamsObj[player.team_id].players.unshift({
            id: player.player_id,
            name: player.name,
            image: player.player_img,
            is_captain: true
          })
        } else {
          teamsObj[player.team_id].players.push({
            id: player.player_id,
            name: player.name,
            image: player.player_img,
            is_captain: false
          })
        }

      })
      let teams = []
      for (const key in teamsObj) {
        teams.push(teamsObj[key]);
      }
      let res = { ...leaguePlayers, teams: teams }
      delete res.players;
      return res
    },
    async findAllPlayersOfLeague(ctx) {
      let league = await this.findLeague(ctx)
      let players = await strapi.db.connection.raw(
        `
        select distinct(p.id) as player_id ,p.name,ptl.player_order , fp.formats -> 'thumbnail' ->> 'url' as player_img ,  
        t.id as team_id, t.name as team_name, ft.formats -> 'thumbnail' ->> 'url' as team_logo
        from leagues l 
        inner join matches_albtwlt_links mll on l.id = mll.league_id
        inner join matches m on  m.id = mll.match_id
        inner join matches_team_1_links mt1l on m.id = mt1l.match_id
        inner join teams t on t.id = mt1l.team_id
        inner join players_team_links ptl on ptl.team_id = t.id
        inner join players p on p.id = ptl.player_id
        inner join files_related_morphs frmt on frmt.related_id = t.id
        inner join files ft on frmt.file_id = ft.id
        inner join files_related_morphs frmp on frmp.related_id = p.id
        inner join files fp on frmp.file_id = fp.id
        where l.id = ${league.id} and  l.published_at is not null and frmt.related_type = 'api::team.team'  and frmp.related_type = 'api::player.player'

        union 

        select distinct(p.id) as player_id ,p.name,ptl.player_order , fp.formats -> 'thumbnail' ->> 'url' as player_img ,  
            t.id as team_id, t.name as team_name, ft.formats -> 'thumbnail' ->> 'url' as team_logo
        from leagues l 
        inner join matches_albtwlt_links mll on l.id = mll.league_id
        inner join matches m on  m.id = mll.match_id
        inner join matches_team_2_links mt1l on m.id = mt1l.match_id
        inner join teams t on t.id = mt1l.team_id
        inner join players_team_links ptl on ptl.team_id = t.id
        inner join players p on p.id = ptl.player_id
        inner join files_related_morphs frmt on frmt.related_id = t.id
        inner join files ft on frmt.file_id = ft.id
        inner join files_related_morphs frmp on frmp.related_id = p.id
        inner join files fp on frmp.file_id = fp.id
        where l.id = ${league.id} and l.published_at is not null and frmt.related_type = 'api::team.team'  and frmp.related_type = 'api::player.player';
    `)
      return { ...league, players: players.rows }
    },
    async findAllMatchesOfLeague(ctx) {
      let league = await this.findLeague(ctx)
      let data = await strapi.db.connection.raw(`
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
          where l.id = ${league.id} and  l.published_at is not null and  frm1.related_type = 'api::team.team' and frm2.related_type = 'api::team.team'
          order by m.start_at;      
      `)
      return { ...league, matches: data.rows };
    },
    async findLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }

      let leagueDate = await strapi.db.connection.raw(`
        select l.id , l.name , f.url
        from leagues l
        inner join files_related_morphs frm on frm.related_id = l.id
        inner join files f on frm.file_id = f.id
        where l.id = ${leagueId} and l.published_at is not null and frm.related_type = 'api::league.league' and frm.field = 'image';
        `)

      if (leagueDate.rows.length === 0) {
        ctx.throw(404, "League Not Found");
      }
      return { ...leagueDate.rows[0] }
    },
    async statistics(ctx) {
      let league = await this.findLeague(ctx)
      let leagueId = strapi.requestContext.get().params.id;

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
      let res = { data: data.rows }
      return res

    },
    async upcoming(ctx) {
      try {
        const leaguesData = await strapi.db.connection.raw(`
        select  l.id , l.name, fb.url as logo_background  , fl.url as champ_logo
        from leagues l
        left join files_related_morphs frmb on frmb.related_id = l.id
        left join files fb on frmb.file_id = fb.id

        left join files_related_morphs frml on frml.related_id = l.id
        left join files fl on frml.file_id = fl.id 

        where frmb.related_type = 'api::league.league' and frmb.field = 'ad_image' and frml.related_type = 'api::league.league' and frml.field = 'image' and l.published_at is not null and (l.state = 'upcoming' or l.state = 'live' );

    `)
        return { data: leaguesData.rows }
      } catch (error) {
        console.error(error);
        return { error_text: "error in fetching data from db" }
      }

    }
  };
});

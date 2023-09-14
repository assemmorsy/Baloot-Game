const teamRepo = require("./teamsRepo")
const getTeamsOfLeague = async (leagueId) => {
    try {
        let leagueData = await getLeagueInfoById(leagueId)
        if (leagueData === -1) return -1;
        let teamsIds = await strapi.db.connection.raw(`
            select distinct(t.id)
            from leagues l 
            inner join matches_albtwlt_links mll on l.id = mll.league_id
            inner join matches m on  m.id = mll.match_id
            inner join matches_team_1_links mt1l on m.id = mt1l.match_id
            inner join teams t on t.id = mt1l.team_id
            where l.id = ${leagueId} and l.published_at is not null
            
            union 
            
            select distinct(t.id)
            from leagues l 
            inner join matches_albtwlt_links mll on l.id = mll.league_id
            inner join matches m on  m.id = mll.match_id
            inner join matches_team_2_links mt1l on m.id = mt1l.match_id
            inner join teams t on t.id = mt1l.team_id
            where l.id = ${leagueId} and l.published_at is not null;
        `);
        let teams = await Promise.all(teamsIds.rows.map(async (team) => {
            let teamData = await teamRepo.getTeamInfoById(team.id);
            let teamPlayers = await teamRepo.getPlayersByTeamId(team.id, leagueData.end_at);
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
    and l.published_at is not null and ( l.state = 'upcoming' and l.is_join_requests_open = true );
    `)
    return leaguesData.rows
}
module.exports = {
    getTeamsOfLeague,
    getLeagueInfoById,
    getLatestLeagues,
    getOpenToJoinLeagues
}
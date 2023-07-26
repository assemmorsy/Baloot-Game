"use strict";
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::league.league", ({ strapi }) => {
  return {
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
        select s.id as studio_id , a.name as analyst_name , a.id as analyst_id ,s.name as studio_name , s.start_at , s.url ,t.name as tournament_name
        from leagues l 
        inner join tournaments_league_links ttl on ttl.league_id = l.id
        inner join tournaments t on ttl.tournament_id = t.id
        inner join tournaments_studio_links tsl on tsl.tournament_id = t.id
        inner join studios s on  s.id = tsl.studio_id
        inner join analysts_studio_links asl on asl.studio_id = s.id
        inner join analysts a on a.id = asl.analyst_id
        where l.id = ${league.id}
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
        inner join tournaments_league_links ttl on ttl.league_id = l.id
        inner join tournaments t on ttl.tournament_id = t.id
        inner join matches_tournament_links mtl on mtl.tournament_id = t.id
        inner join matches_referees_links mrl on mrl.match_id = mtl.match_id
        inner join referees r on r.id = mrl.referee_id
        inner join files_related_morphs frmr on frmr.related_id = r.id
        inner join files fr on frmr.file_id = fr.id
        where l.id = ${league.id} and frmr.related_type = 'api::referee.referee' 
      `)
      return { ...league, referees: referees.rows }
    },
    async findAllTeamsOfLeague(ctx) {
      let leaguePlayers = await this.findAllPlayersOfLeague(ctx);
      let teams = {}
      leaguePlayers.players.forEach((player) => {
        if (!Object.hasOwnProperty.call(teams, player.team_id)) {
          teams[player.team_id] = {
            name: player.team_name,
            id: player.team_id,
            logo: player.team_logo,
            players: []
          }
        }
        if (player.player_order === 1) {
          teams[player.team_id].players.unshift({
            id: player.player_id,
            name: player.name,
            image: player.player_img,
            is_captain: true
          })
        } else {
          teams[player.team_id].players.push({
            id: player.player_id,
            name: player.name,
            image: player.player_img,
            is_captain: false
          })
        }

      })
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
          inner join tournaments_league_links ttl on ttl.league_id = l.id
          inner join tournaments tourn on ttl.tournament_id = tourn.id
          inner join matches_tournament_links mtl on mtl.tournament_id = tourn.id
          inner join matches m on  m.id = mtl.match_id
          inner join matches_team_1_links mt1l on m.id = mt1l.match_id
          inner join teams t on t.id = mt1l.team_id
          inner join players_team_links ptl on ptl.team_id = t.id
          inner join players p on p.id = ptl.player_id
          inner join files_related_morphs frmt on frmt.related_id = t.id
          inner join files ft on frmt.file_id = ft.id
          inner join files_related_morphs frmp on frmp.related_id = p.id
          inner join files fp on frmp.file_id = fp.id
          where l.id = ${league.id} and frmt.related_type = 'api::team.team'  and frmp.related_type = 'api::player.player'

          union 

          select distinct(p.id) as player_id ,p.name,ptl.player_order , fp.formats -> 'thumbnail' ->> 'url' as player_img ,  
              t.id as team_id, t.name as team_name, ft.formats -> 'thumbnail' ->> 'url' as team_logo
          from leagues l 
          inner join tournaments_league_links ttl on ttl.league_id = l.id
          inner join tournaments tourn on ttl.tournament_id = tourn.id
          inner join matches_tournament_links mtl on mtl.tournament_id = tourn.id
          inner join matches m on  m.id = mtl.match_id
          inner join matches_team_2_links mt1l on m.id = mt1l.match_id
          inner join teams t on t.id = mt1l.team_id
          inner join players_team_links ptl on ptl.team_id = t.id
          inner join players p on p.id = ptl.player_id
          inner join files_related_morphs frmt on frmt.related_id = t.id
          inner join files ft on frmt.file_id = ft.id
          inner join files_related_morphs frmp on frmp.related_id = p.id
          inner join files fp on frmp.file_id = fp.id
          where l.id = ${league.id} and frmt.related_type = 'api::team.team'  and frmp.related_type = 'api::player.player';
    `)
      return { ...league, players: players.rows }
    },
    async findAllMatchesOfLeague(ctx) {
      let league = await this.findLeague(ctx)
      let data = await strapi.db.connection.raw(`
          select m.id,t1.name as team_1_name,m.team_1_score, f1.formats -> 'thumbnail' ->> 'url' as team_1_logo,t2.name as team_2_name,m.team_2_score,f2.formats -> 'thumbnail' ->> 'url' as team_2_logo, m.state ,m.url, m.start_at,t.name as tournament_name
          from leagues l 
          inner join tournaments_league_links ttl on ttl.league_id = l.id
          inner join tournaments t on ttl.tournament_id = t.id
          inner join matches_tournament_links mtl on mtl.tournament_id = t.id
          inner join matches m on m.id = mtl.match_id
          inner join matches_team_1_links mt1l on m.id = mt1l.match_id
          inner join matches_team_2_links mt2l on m.id = mt2l.match_id
          inner join teams t1 on t1.id = mt1l.team_id
          inner join teams t2 on t2.id = mt2l.team_id
          inner join files_related_morphs frm1 on frm1.related_id = t1.id
          inner join files_related_morphs frm2 on frm2.related_id = t2.id
          inner join files f1 on frm1.file_id = f1.id
          inner join files f2 on frm2.file_id = f2.id
          where l.id = ${league.id} and frm1.related_type = 'api::team.team' and frm2.related_type = 'api::team.team'
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
        select l.id , l.name , f.formats -> 'thumbnail' ->> 'url' as logo
        from leagues l
        inner join files_related_morphs frm on frm.related_id = l.id
        inner join files f on frm.file_id = f.id
        where l.id = ${leagueId} and frm.related_type = 'api::league.league';
        `)

      if (leagueDate.rows.length === 0) {
        console.log("from in valid ID from sql query");
        ctx.throw(404, "League Not Found");
      }
      return { ...leagueDate.rows[0] }
    },
    async statistics(ctx) {
      let league = await this.findLeague(ctx)
      let data = await strapi.db.connection.raw(`
      select name as "1 الاسم" , 
  	  sum(skaat_played) as "عدد الصكات الملعوبة 2" , 
      sum(skaat_winned) as "3 عدد الصكات المربوحة" ,sum(skaat_played) - sum(skaat_winned) as "4 عدد الصكات الخاسرة" , 
	  sum(abnat) as "5 الابناط" ,
      sum(akak) as "6 الاكك", sum(akalat) as "7 الأكلات" , sum(moshtary_sun) as "8 مشترى صن" ,
      sum(moshtary_hakam) as "9 مشترى حكم", sum(moshtrayat_nagha) as "10 مشتريات ناجحة" , sum(moshtrayat_khasera) as "11 مشتريات خسرانة",
      sum(sra) as "12 سرا", sum(baloot) as "13 بلوت" , sum(khamsin) as "14 خمسين" ,
      sum("100") as "15 مية" , sum("400") as "16 أربعمية" , sum(kababit_sun_count) as "عدد الكبابيت صن 17" ,
      sum(kababit_hakam_count) as "18 عدد الكبابيت حكم"
    from (
      SELECT t.name, sum(number_of_rounds)  as skaat_played  ,sum(team_2_score) as skaat_winned ,
        sum(team_2_akak) as akak, sum(team_2_akalat) as akalat , sum(team_2_moshtary_sun) as moshtary_sun ,
        sum(team_2_moshtary_hakam) as moshtary_hakam, sum(team_2_moshtrayat_nagha) as moshtrayat_nagha , sum(team_2_moshtrayat_khasera) as moshtrayat_khasera,
        sum(team_2_sra) as sra, sum(team_2_baloot) as baloot , sum(team_2_khamsin) as khamsin ,
        sum(team_2_100) as "100" , sum(team_2_400) as "400" , sum(team_2_kababit_sun_count) as kababit_sun_count ,
        sum(team_2_kababit_hakam_count) as kababit_hakam_count, sum(team_2_abnat) as abnat 
      FROM public.matches m  
        join public.matches_team_2_links mt2l on mt2l.match_id = m.id
        join public.teams t on t.id = mt2l.team_id
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
        join public.teams t on t.id = mt1l.team_id
      group by (t.name)
    ) as nt group by nt.name ;
      `)
      if (data.rows.length === 0) {
        ctx.throw(404, "League or Table Not Found");
      } else {
        let res = { data: data.rows }
        return res
      }
    }
  };
});

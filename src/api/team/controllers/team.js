'use strict';

/**
 * team controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::team.team',
    ({ strapi }) => {
        return {
            async find(ctx) {
                try {
                    let teamsData = await strapi.db.connection.raw(`
                    select t.id , t.name , t.founded_in , ft.formats -> 'thumbnail' ->> 'url' as team_logo , count(lcl.league_id) as winning_count
                    from teams t 
                    inner join files_related_morphs frmt on frmt.related_id = t.id
                    inner join files ft on frmt.file_id = ft.id
                    left join  leagues_champion_links lcl on lcl.team_id = t.id
                    where frmt.related_type = 'api::team.team'
                    group by (t.id , t.name , t.founded_in , ft.formats )
                    order by winning_count desc , t.founded_in asc;
                `)
                    return { teams: [...teamsData.rows] }
                } catch (error) {
                    console.error(error);
                    return { error_text: "error in fetching data from db" }
                }

            }, async findOne(ctx) {
                let teamId = strapi.requestContext.get().params.id;
                if (!teamId || isNaN(teamId)) {
                    ctx.throw(400, "Invalid Team Id");
                }

                try {
                    let teamData = await strapi.db.connection.raw(`
                        select t.id , t.name , t.founded_in , ft.formats -> 'thumbnail' ->> 'url' as team_logo , count(lcl.league_id) as winning_count
                        from teams t 
                        inner join files_related_morphs frmt on frmt.related_id = t.id
                        inner join files ft on frmt.file_id = ft.id
                        left join  leagues_champion_links lcl on lcl.team_id = t.id
                        where t.id = ${teamId} and  frmt.related_type = 'api::team.team'
                        group by (t.id , t.name , t.founded_in , ft.formats); `)
                    if (teamData.rows.length !== 1) ctx.throw(404, "Team Not Found");

                    let teamPlayers = await strapi.db.connection.raw(` 
                        select p.id , p.name  , fp.formats -> 'thumbnail' ->> 'url' as image
                        from teams t 
                        join players_team_links ptl on ptl.team_id = t.id
                        join players p on p.id = ptl.player_id
                        inner join files_related_morphs frmp on frmp.related_id = p.id
                        inner join files fp on frmp.file_id = fp.id
                        where t.id = ${teamId} and frmp.related_type = 'api::player.player'
                        order by ptl.player_order`);
                    let WonAtChampions = await strapi.db.connection.raw(
                        `
                        select l.id,l.name , l.end_at , fl.formats -> 'thumbnail' ->> 'url' as logo
                        from teams t 
                        join leagues_champion_links lcl on lcl.team_id = t.id
                        join leagues l on lcl.league_id = l.id
                        inner join files_related_morphs frml on frml.related_id = l.id
                        inner join files fl on frml.file_id = fl.id
                        where t.id = ${teamId} and frml.related_type = 'api::league.league' ;
                        `
                    )
                    let teamStatistics = await strapi.db.connection.raw(`
                        select sum(played_matches) as "عدد المباريات" , 
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
                                    SELECT sum(number_of_rounds)  as skaat_played  ,sum(team_2_score) as skaat_winned ,
                                    sum(team_2_akak) as akak, sum(team_2_akalat) as akalat , sum(team_2_moshtary_sun) as moshtary_sun ,
                                    sum(team_2_moshtary_hakam) as moshtary_hakam, sum(team_2_moshtrayat_nagha) as moshtrayat_nagha , sum(team_2_moshtrayat_khasera) as moshtrayat_khasera,
                                    sum(team_2_sra) as sra, sum(team_2_baloot) as baloot , sum(team_2_khamsin) as khamsin ,
                                    sum(team_2_100) as "100" , sum(team_2_400) as "400" , sum(team_2_kababit_sun_count) as kababit_sun_count ,
                                    sum(team_2_kababit_hakam_count) as kababit_hakam_count, sum(team_2_abnat) as abnat  ,count(*) as played_matches
                                    FROM public.matches m  
                                    join public.matches_team_2_links mt2l on mt2l.match_id = m.id 
                                    where mt2l.team_id =  ${teamId} and m.state ='انتهت'
                                
                                    union
                                
                                    SELECT sum(number_of_rounds)  as skaat_played  ,sum(team_1_score) as skaat_winned ,
                                    sum(team_1_akak) as akak, sum(team_1_akalat) as akalat , sum(team_1_moshtary_sun) as moshtary_sun ,
                                    sum(team_1_moshtary_hakam) as moshtary_hakam, sum(team_1_moshtrayat_nagha) as moshtrayat_nagha , sum(team_1_moshtrayat_khasera) as moshtrayat_khasera,
                                    sum(team_1_sra) as sra, sum(team_1_baloot) as baloot , sum(team_1_khamsin) as khamsin ,
                                    sum(team_1_100) as "100" , sum(team_1_400) as "400" , sum(team_1_kababit_sun_count) as kababit_sun_count ,
                                    sum(team_1_kababit_hakam_count) as kababit_hakam_count, sum(team_1_abnat) as abnat ,count(*) as played_matches
                                    FROM public.matches m  
                                    join public.matches_team_1_links mt1l on mt1l.match_id = m.id 
                                    where mt1l.team_id = ${teamId} and m.state ='انتهت'
                                    )as nt ;
                        `)

                    let playersTransfer = await strapi.db.connection.raw(
                        `	
                        select pt.transfered_at , ft.name as from_team_name ,ftf.formats -> 'thumbnail' ->> 'url' as from_team_logo ,
                        p.id as player_id, p.name ,fp.formats -> 'thumbnail' ->> 'url' as image, tt.name as to_team_name ,ttf.formats -> 'thumbnail' ->> 'url' as to_team_logo 
                        from public.player_transfers pt
                        left join public.player_transfers_from_team_links ftl on ftl.player_transfer_id = pt.id
                        left join public.teams ft on ft.id = ftl.team_id 
                        left join public.player_transfers_to_team_links ttl on ttl.player_transfer_id = pt.id
                        left join public.teams tt on tt.id = ttl.team_id
                        inner join public.player_transfers_player_links pl on pl.player_transfer_id = pt.id
                        inner join players p on p.id = pl.player_id

                        inner join files_related_morphs frmp on frmp.related_id = p.id
                        inner join files fp on frmp.file_id = fp.id

                        left join files_related_morphs frmft on frmft.related_id = ft.id
                        left join files ftf on frmft.file_id = ftf.id

                        left join files_related_morphs frmtt on frmtt.related_id = tt.id
                        left join files ttf on frmtt.file_id = ttf.id

                        where (tt.id = ${teamId} or ft.id = ${teamId}) and frmp.related_type = 'api::player.player' and
                        (frmft.related_type = 'api::team.team' or frmft.related_type is null)
                        and (frmtt.related_type = 'api::team.team' or frmtt.related_type is null)
                        order by pt.transfered_at  desc;
                        `
                    )
                    return { data: { ...teamData.rows[0], players: [...teamPlayers.rows], champs: [...WonAtChampions.rows], statistics: { ...teamStatistics.rows[0] }, transfers: [...playersTransfer.rows] } }
                } catch (error) {
                    console.error(error);
                    return { error_text: "error in fetching data from db" }
                }

            }
        }
    });

'use strict';

/**
 * league controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::league.league', ({ strapi }) => {
    return {
        async findAllPlayersOfLeague(ctx) {
            let leagueId = strapi.requestContext.get().params.id;

            const team1_ids = await strapi.db.connection.raw(`
                select DISTINCT( mt1L.team_id )from matches 
                JOIN  matches_team_1_links mt1L on mt1L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `)
            const team2_ids = await strapi.db.connection.raw(`
                select DISTINCT( mt2L.team_id )from matches 
                JOIN  matches_team_2_links mt2L on mt2L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `)

            if (team1_ids && team1_ids.length > 0 && team2_ids && team2_ids.length > 0) {
                const teams_ids = [...new Set([...team1_ids, ...team2_ids])]
                try {
                    let teams = await Promise.all(teams_ids.map(async (elm) => {
                        return await strapi.entityService.findOne("api::team.team", elm.team_id, {
                            fields: ["id", "name"],
                            populate: {
                                players: {
                                    fields: ["id", "name"],
                                    populate: {
                                        image: {
                                            fields: ["formats"]
                                        }
                                    }
                                },
                                logo: {
                                    fields: ["formats"]
                                }
                            }
                        })
                    }))
                    return teams.map((team) => {
                        return {
                            ...team,
                            logo: team.logo.formats.thumbnail.url,
                            players: team.players.map((player) => {
                                return {
                                    ...player,
                                    image: player.image ? player.image.formats.thumbnail.url : null
                                }

                            })
                        }
                    })
                } catch (err) {
                    console.error(err)
                }
            } else {
                //throw error not found 
            }



        },
        async findAllMatchesOfLeague(ctx) {

            let leagueId = strapi.requestContext.get().params.id;
            const matchesIds = await strapi.db.connection.raw(`
                SELECT match_id  from matches_tournament_links where  tournament_id in 
                    (SELECT tournament_id from tournaments_league_links WHERE league_id = ${leagueId});`)

            if (matchesIds && matchesIds.length > 0) {
                try {

                    let matches = await Promise.all(matchesIds.map(async (elm) => {
                        let match = await strapi.entityService.findOne("api::match.match", parseInt(elm.match_id), {
                            fields: ["id", "state", "start_at", "team_1_score", "team_2_score"],
                            populate: {
                                tournament: {
                                    fields: ["id", "name"]
                                },
                                team_1: {
                                    fields: ["id", "name"],
                                    populate: {
                                        logo: {
                                            fields: ["formats"]
                                        }
                                    }
                                }, team_2: {
                                    fields: ["id", "name"],
                                    populate: {
                                        logo: {
                                            fields: ["formats"]
                                        }
                                    }
                                }
                            }
                        });
                        return match
                    }))

                    return matches.map((match) => {
                        // console.log(match)
                        let newMatch = {
                            ...match,
                            team_1: { id: match.team_1.id, name: match.team_1.name, score: match.team1_score, logo: match.team_1.logo.formats.thumbnail.url },
                            team_2: { id: match.team_2.id, name: match.team_2.name, score: match.team2_score, logo: match.team_2.logo.formats.thumbnail.url },
                        }

                        delete newMatch.team1_score
                        delete newMatch.team2_score
                        return newMatch
                    })
                } catch (err) {
                    console.error(err, 'background: #222; color: #ff0000');
                }
            } else {
                //throw error not found 
                // return ctx.NotFound('League Not Found') // causes an error
            }
        }
    }
});

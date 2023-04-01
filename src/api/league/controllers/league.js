'use strict';

/**
 * league controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::league.league', ({ strapi }) => {
    return {
        async findAllPlayersOfLeague(ctx) {
            let leagueId = strapi.requestContext.get().params.id;
            
            const playersIds = await strapi.db.connection.raw(`
            SELECT players.id FROM players WHERE players.id in 
            (SELECT player_id from players_team_links where players_team_links.team_id in 
            (SELECT team_id FROM matches_tournament_links mt WHERE mt.tournament_id in
            (SELECT tournament_id from tournaments_league_links tm where tm.league_id =${leagueId})
            )
            );`)


            try {
                let players = await Promise.resolve(playersIds.map( async (record) => {
                    let player =  await strapi.entityService.findOne("api::player.player",parseInt(record.id),{
                        fields:["id", "name",],
                        populate: {
                            team: {
                                fields:["id","name",]
                            },
                            image:{
                                fields:["formats"]
                            }

                        }
                       
                    }) 
                    // return player
                }))
                // return players
            } catch (err) {
                console.error(err)
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
                        console.log(match)
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
                
                // return ctx.NotFound('League Not Found') // causes an error
            }
        }
    }
});

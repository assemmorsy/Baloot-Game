'use strict';

/**
 * match controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::match.match', ({ strapi }) => {
    return {
        async findOne(ctx) {
            let matchId = strapi.requestContext.get().params.id;
            if (!matchId || isNaN(matchId)) {
                ctx.throw(404, "Match Not Found");
            }
            try {
                const match = await strapi.entityService.findOne("api::match.match", matchId, {
                    populate: {
                        tournament: {
                            fields: ["id", "name"],
                        },
                        team_1: {
                            fields: ["id", "name"],
                            populate: {
                                logo: {
                                    fields: ["formats"],
                                },
                                players: {
                                    populate: {
                                        image: {
                                            fields: ["formats"],
                                        }
                                    }
                                }
                            },
                        },
                        team_2: {
                            fields: ["id", "name"],
                            populate: {
                                logo: {
                                    fields: ["formats"],
                                },
                                players: {
                                    populate: {
                                        image: {
                                            fields: ["formats"],
                                        }
                                    }
                                }
                            },
                        },
                    },
                })
                const mappedMatch = {
                    state: match.state,
                    start_at: match.start_at,
                    url: match.url,
                    numberOfRounds: match.numberOfRounds,
                    tournament: match.tournament.name,
                    team1: {
                        id: match.team_1.id,
                        name: match.team_1.name,
                        score: match.team1_score,
                        logo: match.team_1.logo?.formats.thumbnail.url,
                        players: match.team_1.players.map((p) => {
                            return {
                                id: p.id,
                                name: p.name,
                                image: p.image?.formats.thumbnail.url
                            }
                        }),
                        statistics: {
                            akak: match.team1_akak,
                            akalat: match.team1_akalat,
                            moshtary_sun: match.team1_moshtary_sun,
                            moshtary_hakam: match.team1_moshtary_hakam,
                            moshtrayat_nagha: match.team1_moshtrayat_nagha,
                            moshtrayat_khasera: match.team1_moshtrayat_khasera,
                            sra: match.team1_sra,
                            baloot: match.team1_baloot,
                            khamsin: match.team1_khamsin,
                            100: match.team1_100,
                            400: match.team1_400,
                            kababit_sun_count: match.team1_kababit_sun_count,
                            kababit_hakam_count: match.team1_kababit_hakam_count
                        }

                    },
                    team2: {
                        id: match.team_2.id,
                        name: match.team_2.name,
                        score: match.team2_score,
                        logo: match.team_2.logo?.formats.thumbnail.url,
                        players: match.team_2.players.map((p) => {
                            return {
                                id: p.id,
                                name: p.name,
                                image: p.image?.formats.thumbnail.url
                            }
                        }),
                        statistics: {
                            akak: match.team2_akak,
                            akalat: match.team2_akalat,
                            moshtary_sun: match.team2_moshtary_sun,
                            moshtary_hakam: match.team2_moshtary_hakam,
                            moshtrayat_nagha: match.team2_moshtrayat_nagha,
                            moshtrayat_khasera: match.team2_moshtrayat_khasera,
                            sra: match.team2_sra,
                            baloot: match.team2_baloot,
                            khamsin: match.team2_khamsin,
                            100: match.team2_100,
                            400: match.team2_400,
                            kababit_sun_count: match.team2_kababit_sun_count,
                            kababit_hakam_count: match.team2_kababit_hakam_count
                        }
                    }
                }
                return mappedMatch
            } catch (err) {
                console.error(err)
                ctx.throw(404, "Match Not Found ")
            }
        },

    }
});

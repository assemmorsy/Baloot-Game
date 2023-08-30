'use strict';

/**
 * match controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::match.match', ({ strapi }) => {
    return {

        async getById(ctx) {
            let matchId = strapi.requestContext.get().params.id;
            if (!matchId || isNaN(matchId)) {
                ctx.throw(404, "Match Not Found");
            }
            try {
                const match = await strapi.entityService.findOne("api::match.match", matchId, {
                    populate: {
                        albtwlt: {
                            fields: ["name"]
                        },

                        team_1: {
                            fields: ["id", "name"],
                            populate: {
                                logo: {
                                    fields: ["formats"],
                                },
                                // players: {
                                //     populate: {
                                //         image: {
                                //             fields: ["formats"],
                                //         }
                                //     }
                                // }
                            },
                        },
                        team_2: {
                            fields: ["id", "name"],
                            populate: {
                                logo: {
                                    fields: ["formats"],
                                },
                                // players: {
                                //     populate: {
                                //         image: {
                                //             fields: ["formats"],
                                //         }
                                //     }
                                // }
                            },
                        },
                        team1_players: {
                            fields: ["id", "name"],
                            populate: { image: { fields: ["formats"] } }
                        },
                        team2_players: {
                            fields: ["id", "name"],
                            populate: { image: { fields: ["formats"] } }
                        },
                        referees: {
                            fields: ["id", "name"],
                            populate: { image: { fields: ["formats"] } }
                        }

                    },
                })

                const mappedMatch = {
                    leagueName: match.albtwlt.name,
                    state: match.state,
                    start_at: match.start_at,
                    url: match.url,
                    numberOfRounds: match.numberOfRounds,
                    tournament: match.tournment_name,
                    referees: match.referees.map((ref) => {
                        return {
                            id: ref.id,
                            name: ref.name,
                            image: ref.image ? ref.image.formats.thumbnail.url : null
                        }
                    }),
                    team1: {
                        id: match.team_1.id,
                        name: match.team_1.name,
                        score: match.team1_score,
                        logo: match.team_1.logo?.formats.thumbnail.url,
                        players: match.team1_players.map((p) => {
                            return {
                                id: p.id,
                                name: p.name,
                                image: p.image?.formats.thumbnail.url
                            }
                        }),
                        statistics: [
                            { value: match.team1_akak, name: "عدد الأكك" },
                            { value: match.team1_akalat, name: "الأكلات" },
                            { value: match.team1_moshtary_sun, name: "مشترى صن" },
                            { value: match.team1_moshtary_hakam, name: "مشترى حكم" },
                            { value: match.team1_moshtrayat_nagha, name: "مشتريات ناجحة" },
                            { value: match.team1_moshtrayat_khasera, name: "مشتريات خسرانة" },
                            { value: match.team1_sra, name: "سرا" },
                            { value: match.team1_baloot, name: "بلوت" },
                            { value: match.team1_khamsin, name: "خمسين" },
                            { value: match.team1_100, name: "مية" },
                            { value: match.team1_400, name: "أربعمية" },
                            { value: match.team1_kababit_sun_count, name: "عدد الكبابيت صن" },
                            { value: match.team1_kababit_hakam_count, name: "عدد الكبابيت حكم" },
                        ]

                    },
                    team2: {
                        id: match.team_2.id,
                        name: match.team_2.name,
                        score: match.team2_score,
                        logo: match.team_2.logo?.formats.thumbnail.url,
                        players: match.team2_players.map((p) => {
                            return {
                                id: p.id,
                                name: p.name,
                                image: p.image?.formats.thumbnail.url
                            }
                        }),
                        statistics: [
                            { value: match.team2_akak, name: "عدد الأكك" },
                            { value: match.team2_akalat, name: "الأكلات" },
                            { value: match.team2_moshtary_sun, name: "مشترى صن" },
                            { value: match.team2_moshtary_hakam, name: "مشترى حكم" },
                            { value: match.team2_moshtrayat_nagha, name: "مشتريات ناجحة" },
                            { value: match.team2_moshtrayat_khasera, name: "مشتريات خسرانة" },
                            { value: match.team2_sra, name: "سرا" },
                            { value: match.team2_baloot, name: "بلوت" },
                            { value: match.team2_khamsin, name: "خمسين" },
                            { value: match.team2_100, name: "مية" },
                            { value: match.team2_400, name: "أربعمية" },
                            { value: match.team2_kababit_sun_count, name: "عدد الكبابيت صن" },
                            { value: match.team2_kababit_hakam_count, name: "عدد الكبابيت حكم" },
                        ]
                    }
                }
                return mappedMatch
            } catch (err) {
                console.error(err)
                ctx.throw(404, "Match Not Found ")
            }
        },
        async getUpcoming() {
            try {
                let officialMatches = await strapi.db.connection.raw(` select m.id,t1.name as team_1_name,m.team_1_score,
                    f1.formats -> 'thumbnail' ->> 'url' as team_1_logo,t2.name as team_2_name,m.team_2_score,f2.formats -> 'thumbnail' ->> 'url' as team_2_logo, 
                    m.state ,m.url, m.start_at,m.tournment_name as tournament_name , l.name, m.type , l.id as league_id
                    from matches m
                    inner join matches_albtwlt_links mll on m.id = mll.match_id
                    inner join leagues l on  l.id = mll.league_id
                    inner join matches_team_1_links mt1l on m.id = mt1l.match_id
                    inner join matches_team_2_links mt2l on m.id = mt2l.match_id
                    inner join teams t1 on t1.id = mt1l.team_id
                    inner join teams t2 on t2.id = mt2l.team_id
                    inner join files_related_morphs frm1 on frm1.related_id = t1.id
                    inner join files_related_morphs frm2 on frm2.related_id = t2.id
                    inner join files f1 on frm1.file_id = f1.id
                    inner join files f2 on frm2.file_id = f2.id
                    where l.published_at is not null and m.start_at::date >= CURRENT_DATE and m.type = 'official'
                    and frm1.related_type = 'api::team.team' and frm2.related_type = 'api::team.team'
                    order by m.start_at 
                    limit 5; `)
                return { matches: [...officialMatches.rows] }

            } catch (error) {
                console.error(error);
                return { error: "can't fetch the data from db" }
            }
        }
    }
});
;
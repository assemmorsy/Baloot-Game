"use strict";

const { log } = require("console");

/**
 * league controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

function orederTeams(team1, team2) {
  if (team1.totalScore === team2.totalScore) {
    return team2.abnat - team1.abnat;
  } else {
    return team2.totalScore - team1.totalScore;
  }
}

module.exports = createCoreController("api::league.league", ({ strapi }) => {
  return {
    async findAllTeamsofLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        // Throw Error
        console.log("Invalid league Id");
        ctx.throw(404, "League Not Found");
      }
      const team1_ids = (await strapi.db.connection.raw(`
                select DISTINCT( mt1L.team_id )from matches 
                Join  matches_team_1_links mt1L on mt1L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `))?.rows;
      const team2_ids = (await strapi.db.connection.raw(`
                select DISTINCT( mt2L.team_id )from matches 
                Join  matches_team_2_links mt2L on mt2L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `))?.rows;
      if (
        team1_ids &&
        team1_ids.length > 0 &&
        team2_ids &&
        team2_ids.length > 0
      ) {
        const teams_ids = [...new Set([...(team1_ids.map(elm => elm.team_id)), ...(team2_ids.map(elm => elm.team_id))])];
        console.log(teams_ids);
        try {
          let teams = await Promise.all(
            teams_ids.map(async (elm) => {
              return await strapi.entityService.findOne(
                "api::team.team",
                elm,
                {
                  fields: ["id", "name"],
                  populate: {
                    logo: {
                      fields: ["formats"],
                    },
                  },
                }
              );
            })
          );
          return teams.map((team) => {
            return {
              ...team,
              logo: team.logo?.formats.thumbnail.url,
            };
          });
        } catch (err) {
          console.error(
            "===========> ERROR IN players In league Controller<==========="
          );
          console.error(err);
        }
      } else {
        // Throw Error
        console.log("error league has no matches");
        ctx.throw(404, "League has no Matches");
      }
    },
    async summary(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      try {
        let tableObj = {};

        const league = await strapi.entityService.findOne("api::league.league", leagueId, {
          fields: ["id", "name"],
          populate: {
            image: {
              fields: "formats"
            }
          }
        })

        let leagueTeams = await this.findAllTeamsofLeague(ctx);
        leagueTeams.forEach((team) => {
          tableObj[team.id] = {
            id: team.id,
            name: team.name,
            abnat: 0,
            play: 0,
            lost: 0,
            win: 0,
            totalScore: 0,
            totalScoreForAbnat: 0,
            totalNumberOfRounds: 0
          };
        });

        let matches = await this.findAllMatchesOfLeague(ctx);

        for (let matchIdx = 0; matchIdx < matches.length; matchIdx++) {
          const match = matches[matchIdx];
          if (match.state !== "انتهت") continue;
          for (let teamIdx = 1; teamIdx <= 2; teamIdx++) {
            const team = match[`team_${teamIdx}`];
            tableObj[team.id].totalScoreForAbnat += team.totalScoreForAbnat;
            tableObj[team.id].totalNumberOfRounds += team.totalNumberOfRounds;
            tableObj[team.id].play++;
          }
          if (match.team_1.score > match.team_2.score) {
            tableObj[match.team_1.id].win++;
            tableObj[match.team_1.id].totalScore = tableObj[match.team_1.id].win * 3;
            tableObj[match.team_2.id].lost++;

          } else {
            tableObj[match.team_2.id].win++;
            tableObj[match.team_2.id].totalScore = tableObj[match.team_2.id].win * 3;
            tableObj[match.team_1.id].lost++;
          }
          tableObj[match.team_1.id].abnat = (tableObj[match.team_1.id].totalScoreForAbnat / tableObj[match.team_1.id].totalNumberOfRounds).toFixed(1);
          tableObj[match.team_2.id].abnat = (tableObj[match.team_2.id].totalScoreForAbnat / tableObj[match.team_2.id].totalNumberOfRounds).toFixed(1);
        }

        let tableArray = [];
        for (const team_id in tableObj) {
          tableArray.push(tableObj[team_id]);
        }

        return {
          league: {
            ...league,
            image: league.image?.formats.thumbnail.url
          }, table: tableArray.sort(orederTeams)
        };
      } catch (err) {
        console.error(err);
        ctx.throw(404, "League Not Found")
      }

    },
    async findAllStudiosofLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      let studiosIds = (await strapi.db.connection.raw(`
            SELECT studio_id as id FROM tournaments_studio_links WHERE tournament_id in
            (SELECT tournament_id FROM tournaments_league_links WHERE league_id =${leagueId})`))?.rows;
      if (studiosIds && studiosIds.length > 0) {
        try {
          let studios = await Promise.all(
            studiosIds.map(async (studioId) => {
              return await strapi.entityService.findOne(
                "api::studio.studio",
                studioId.id,
                {
                  fields: ["id", "name", "start_at", "url"],
                  populate: {
                    tournament: {
                      fields: ["id", "name"],
                    },
                    analysts: {
                      fields: ["id", "name"],
                      populate: {
                        image: {
                          fields: ["formats"],
                        },
                      },
                    },
                  },
                }
              );
            })
          );

          return studios.map((studio) => {
            return {
              ...studio,
              analysts: studio.analysts.map((analyst) => {
                return {
                  ...analyst,
                  image: analyst.image
                    ? analyst.image.formats.thumbnail.url
                    : null,
                };
              }),
            };
          });
        } catch (err) {
          ctx.throw(404, "League Not Found");
        }
      }
    },
    async findAllRefereesofLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;

      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      const refereesIds = (await strapi.db.connection.raw(`
            SELECT referee_id as id FROM matches_referees_links 
            WHERE matches_referees_links.match_id in 
            (SELECT matches_tournament_links.match_id from matches_tournament_links 
            WHERE matches_tournament_links.tournament_id in
            (SELECT tournaments_league_links.tournament_id FROM tournaments_league_links 
            WHERE tournaments_league_links.league_id = ${leagueId}))`))?.rows.map((elm) => elm.id);
      // console.log(refereesIds);
      if (refereesIds && refereesIds.length > 0) {
        try {
          let referees = await Promise.all(
            refereesIds.map(async (id) => {
              return await strapi.entityService.findOne(
                "api::referee.referee",
                id,
                {
                  fields: ["id", "name"],
                  populate: {
                    image: {
                      fields: ["formats"],
                    },
                  },
                }
              );
            })
          );

          return referees.map((referee) => {
            return {
              ...referee,
              image: referee.image ? referee.image.formats.thumbnail.url : null,
            };
          });
        } catch (err) {
          console.error(err);
        }
      }
    },
    async findAllPlayersOfLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;

      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      const team1_ids = (await strapi.db.connection.raw(`
                select DISTINCT( mt1L.team_id )from matches 
                Join  matches_team_1_links mt1L on mt1L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `))?.rows;
      const team2_ids = (await strapi.db.connection.raw(`
                select DISTINCT( mt2L.team_id )from matches 
                Join  matches_team_2_links mt2L on mt2L.match_id = matches.id  
                where matches.id in 
                (SELECT match_id FROM matches_tournament_links MTourLink WHERE MTourLink.tournament_id in
                (SELECT tournament_id from tournaments_league_links tm where tm.league_id = ${leagueId}));
            `))?.rows;

      if (
        team1_ids &&
        team1_ids.length > 0 &&
        team2_ids &&
        team2_ids.length > 0
      ) {
        const teams_ids = [...new Set([...(team1_ids.map(elm => elm.team_id)), ...(team2_ids.map(elm => elm.team_id))])];
        try {
          let teams = await Promise.all(
            teams_ids.map(async (elm) => {
              return await strapi.entityService.findOne(
                "api::team.team",
                elm,
                {
                  fields: ["id", "name"],
                  populate: {
                    players: {
                      fields: ["id", "name"],
                      populate: {
                        image: {
                          fields: ["formats"],
                        },
                      },
                    },
                    logo: {
                      fields: ["formats"],
                    },
                  },
                }
              );
            })
          );
          return teams.map((team) => {
            return {
              ...team,
              logo: team.logo.formats.thumbnail.url,
              players: team.players.map((player) => {
                return {
                  ...player,
                  image: player.image
                    ? player.image.formats.thumbnail.url
                    : null,
                };
              }),
            };
          });
        } catch (err) {
          console.error(
            "===========> ERROR IN players In league Controller<==========="
          );
          console.error(err);
        }
      } else {
        // Throw Error
        ctx.throw(404, "League Not Found");
      }
    },
    async findAllMatchesOfLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }

      const matchesIds = (await strapi.db.connection.raw(`
                SELECT match_id  from matches_tournament_links where  tournament_id in 
                    (SELECT tournament_id from tournaments_league_links WHERE league_id = ${leagueId});`))?.rows;

      if (matchesIds && matchesIds.length > 0) {
        try {
          let matches = await Promise.all(
            matchesIds.map(async (elm) => {
              let match = await strapi.entityService.findOne(
                "api::match.match",
                parseInt(elm.match_id),
                {
                  fields: [
                    "id",
                    "state",
                    "start_at",
                    "url",
                    "team_1_score",
                    "team_2_score",
                    "team_1_abnat",
                    "team_2_abnat",
                    "numberOfRounds"
                  ],
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
                      },
                    },
                    team_2: {
                      fields: ["id", "name"],
                      populate: {
                        logo: {
                          fields: ["formats"],
                        },
                      },
                    },
                  },
                }
              );
              return match;
            })
          );

          return matches.map((match) => {
            // console.log(match);
            let newMatch = {
              ...match,
              team_1: {
                id: match.team_1.id,
                name: match.team_1.name,
                score: match.team1_score,
                totalScoreForAbnat: match.team1_abnat,
                totalNumberOfRounds: match.numberOfRounds,
                logo: match.team_1.logo?.formats.thumbnail.url,
              },
              team_2: {
                id: match.team_2.id,
                name: match.team_2.name,
                score: match.team2_score,
                totalScoreForAbnat: match.team2_abnat,
                totalNumberOfRounds: match.numberOfRounds,
                logo: match.team_2.logo?.formats.thumbnail.url,
              },
            };

            delete newMatch.team1_score;
            delete newMatch.team2_score;
            return newMatch;
          });
        } catch (err) {
          console.error(
            "===========> ERROR IN matches In league Controller<==========="
          );
          console.error(err);
        }
      } else {
        //throw error League Not Found
        ctx.throw(404, "League Not Found");
      }
    },
  };
});

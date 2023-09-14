'use strict';
const teamRepo = require("../../../Repos/teamsRepo")
/**
 * team controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::team.team', ({ strapi }) => {
    return {
        async getById(ctx) {
            let teamId = strapi.requestContext.get().params.id;

            try {
                const teamData = await teamRepo.getTeamInfoById(teamId)
                if (teamData === -1) ctx.throw(404, "Team Not Found");
                const players = await teamRepo.getPlayersByTeamId(teamId)
                const champs = await teamRepo.getTeamWonAtChampionsById(teamId);
                const statistics = await teamRepo.getTeamTotalStatistics(teamId);
                const transfers = await teamRepo.getPlayerTransfersOfATeamById(teamId);

                return { data: { ...teamData, players, champs, statistics, transfers } }

            } catch (error) {
                return { error_text: "error in fetching data from db" }
            }
        },
        async getAllTeams(ctx) {
            try {
                const teams = await teamRepo.getAllTeams();
                return { teams: teams }
            } catch (error) {
                console.error(error)
            }
        }
    }
});

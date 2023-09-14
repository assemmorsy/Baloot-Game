'use strict';

/**
 * player controller
 */


const { createCoreController } = require('@strapi/strapi').factories;
const playerRepo = require("./../../../Repos/playerRepo")

module.exports = createCoreController('api::player.player',
    ({ strapi }) => {
        return {
            async getById(ctx) {
                let playerId = strapi.requestContext.get().params.id;
                if (!playerId || isNaN(playerId)) {
                    ctx.throw(400, "Invalid player Id");
                }
                try {
                    const playerDate = await playerRepo.getPlayerById(playerId);
                    if (playerDate === -1) ctx.throw(404, "player Not Found");

                    const playerTransfers = await playerRepo.getPlayerTransfersById(playerId);
                    // console.log(playerTransfers);
                    return { data: { ...playerDate, transfers: playerTransfers } }
                } catch (error) {
                    console.error(error);
                    return { error_text: "error in fetching data from db" }
                }
            }
        }
    });

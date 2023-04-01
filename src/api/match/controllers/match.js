'use strict';

/**
 * match controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::match.match', ({ strapi }) => {
    return {
        async table(ctx) {
            return { data: "from table", error: null }
        },

        async find(ctx) {
            try {
                const matches = await strapi.entityService.findMany("api::match.match", {
                    fields: ["start_at", "state"],
                    populate: {
                        team_1: {
                            fields: ["id", "name"]
                        },
                        team_2: true,
                        tournament: true
                    }
                })
                return { data: matches, error: null }
            } catch (err) {
                return { data: null, error: err }
            }
        },

    }
});

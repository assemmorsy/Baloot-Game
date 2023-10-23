'use strict';

/**
 * website-visits-counter controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::website-visits-counter.website-visits-counter', ({ strapi }) => {
    return {
        async addOne() {
            await strapi.db.connection.raw(`
                update website_visits_counters
                set counter = (select counter from website_visits_counters) + 1 
                where  id = 1; 
            `);
        }
    }
});

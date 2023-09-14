'use strict';

/**
 * team-captain service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::team-captain.team-captain');

'use strict';

/**
 * player-transfer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::player-transfer.player-transfer');

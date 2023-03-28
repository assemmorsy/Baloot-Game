'use strict';

/**
 * referee service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::referee.referee');

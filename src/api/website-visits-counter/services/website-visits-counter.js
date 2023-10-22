'use strict';

/**
 * website-visits-counter service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::website-visits-counter.website-visits-counter');

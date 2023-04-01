'use strict';

/**
 * analyst service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::analyst.analyst');

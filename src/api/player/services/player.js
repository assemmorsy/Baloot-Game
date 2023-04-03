'use strict';

/**
 * player service
 */
const { createCoreService } = require('@strapi/strapi').factories;
// const utils = require('@strapi/utils');
// const { ApplicationError } = utils.errors;

module.exports = createCoreService('api::player.player')
// , ({ strapi }) => {
//     return {
//         async create(params) {
//             let okay = false;
//             console.log("-----------------------------------------------");
//             console.log(params);
//             console.log("-----------------------------------------------");

//             // Throwing an error will prevent the restaurant from being created
//             if (!okay) {
//                 throw new ApplicationError('Something went wrong', { foo: 'bar' });
//             }

//             const result = await super.create(params);

//             return result;
//         }
//     }
// });

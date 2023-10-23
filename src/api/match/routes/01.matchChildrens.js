'use strict';

/**
 * match router
 */

module.exports = {
    routes: [
        {
            method: "GET",
            path: "/match/getById/:id",
            handler: "match.getById",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/match/upcoming/",
            handler: "match.getUpcoming",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        

    ]
}
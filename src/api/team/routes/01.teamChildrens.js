'use strict';

/**
 * team router
 */

module.exports = {
    routes: [
        {
            method: "GET",
            path: "/teams/getById/:id",
            handler: "team.getById",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/teams/getAll",
            handler: "team.getAllTeams",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

    ]
}
'use strict';

/**
 * team router
 */

module.exports = {
    routes: [
        {
            method: "GET",
            path: "/players/getById/:id",
            handler: "player.getById",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ]
}
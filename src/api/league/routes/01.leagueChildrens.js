'use strict';

/**
 * league router
 */

//findAllMatchesOfLeague
module.exports = {
    routes: [
        {
            method: "GET",
            path: "/league/:id/players",
            handler: "league.findAllPlayersOfLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        }
        , {
            method: "GET",
            path: "/league/:id/matches",
            handler: "league.findAllMatchesOfLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/league/:id/referees",
            handler: "league.findAllRefereesofLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        
        {
            method: "GET",
            path: "/league/:id/studios",
            handler: "league.findAllStudiosofLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

        {
            method: "GET",
            path: "/league/:id/summary",
            handler: "league.summary",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ]
}
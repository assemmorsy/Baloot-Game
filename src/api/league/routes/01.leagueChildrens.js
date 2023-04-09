'use strict';

/**
 * league router
 */

//findAllMatchesOfLeague
module.exports = {
    routes: [
        {
            method: "GET",
            path: "/leagues/:id/players",
            handler: "league.findAllPlayersOfLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/:id/teams",
            handler: "league.findAllTeamsofLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        }
        , {
            method: "GET",
            path: "/leagues/:id/matches",
            handler: "league.findAllMatchesOfLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/:id/referees",
            handler: "league.findAllRefereesofLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

        {
            method: "GET",
            path: "/leagues/:id/studios",
            handler: "league.findAllStudiosofLeague",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

        {
            method: "GET",
            path: "/leagues/:id/summary",
            handler: "league.summary",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ]
}
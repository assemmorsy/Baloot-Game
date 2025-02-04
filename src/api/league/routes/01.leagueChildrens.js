'use strict';

/**
 * league router
 */

//findAllMatchesOfLeague
module.exports = {
    routes: [
        {
            method: "GET",
            path: "/leagues/get",
            handler: "league.get",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/getById/:id",
            handler: "league.getById",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/upcoming",
            handler: "league.upcoming",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/opened_to_join",
            handler: "league.OpenToJoinLeagues",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
      
        {
            method: "GET",
            path: "/leagues/:id/teams",
            handler: "league.findAllTeamsOfLeague",
            config: {
                auth: false,
                policies: [],
            },
        }
        , {
            method: "GET",
            path: "/leagues/:id/matches",
            handler: "league.findAllMatchesOfLeague",
            config: {
                auth: false,
                policies: [],
            },
        },
       

        {
            method: "GET",
            path: "/leagues/:id/studios",
            handler: "league.findAllStudiosOfLeague",
            config: {
                auth: false,
                policies: [],
            },
        },

        {
            method: "GET",
            path: "/leagues/:id/summary",
            handler: "league.summary",
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/:id/statistics",
            handler: "league.statistics",
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: "GET",
            path: "/leagues/:id/estimations",
            handler: "league.getChampionshipEstimationsTable",
            config: {
                auth: false,
                policies: [],
            },
        },
    ]
}
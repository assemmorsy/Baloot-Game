"use strict";
const { createCoreController } = require("@strapi/strapi").factories;
const leagueRepo = require("./../../../Repos/leagueRepo")
module.exports = createCoreController("api::league.league", ({ strapi }) => {
  return {
    async getById(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      try {
        const leagueData = await leagueRepo.getLeagueFullInfoById(leagueId)
        if (leagueData === -1) {
          ctx.throw(404, "League Not Found");
        }
        return { ...leagueData }
      } catch (error) {
        console.error(error);
        return { error_text: "can't fetch data from db" }
      }

    },
    async get(ctx) {
      const champType = strapi.requestContext.get().query.type;
      const LeaguesData = await leagueRepo.getAllLeagues(champType);
      return { champs: LeaguesData }
    },

    async upcoming(ctx) {
      try {
        const leaguesData = await leagueRepo.getLatestLeagues()
        return { data: leaguesData }
      } catch (error) {
        console.error(error);
        return { error_text: "error in fetching data from db" }
      }
    },
    async OpenToJoinLeagues(ctx) {
      try {
        const leaguesData = await leagueRepo.getOpenToJoinLeagues()
        return { data: leaguesData }
      } catch (error) {
        console.error(error);
        return { error_text: "error in fetching data from db" }
      }
    },

    async summary(ctx) {

      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      const data = await leagueRepo.getLeagueSummary(leagueId)

      if (data === -1) {
        ctx.throw(404, "League or Table Not Found");
      }

      return data

    },
    async findAllTeamsOfLeague(ctx) {
      try {
        let leagueId = strapi.requestContext.get().params.id;
        if (!leagueId || isNaN(leagueId)) {
          console.log("from in valid ID ");
          ctx.throw(404, "League Not Found");
        }
        let leagueData = await leagueRepo.getTeamsOfLeague(leagueId)

        if (leagueData === -1) {
          ctx.throw(404, "League Not Found");
        }
        return leagueData
      } catch (error) {
        console.error(error);
      }
    },

    async findAllStudiosOfLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      let leagueStudiosData = await leagueRepo.getAllStudiosOfLeague(leagueId)

      if (leagueStudiosData === -1) {
        ctx.throw(404, "League Not Found");
      }
      return leagueStudiosData
    },

    async findAllMatchesOfLeague(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      let data = await leagueRepo.getAllMatchesOfLeague(leagueId)

      if (data === -1) {
        ctx.throw(404, "League Not Found");
      }
      return data
    },

    async statistics(ctx) {
      let leagueId = strapi.requestContext.get().params.id;
      if (!leagueId || isNaN(leagueId)) {
        console.log("from in valid ID ");
        ctx.throw(404, "League Not Found");
      }
      let statis = await leagueRepo.getLeagueStatistics(leagueId)

      if (statis === -1) {
        ctx.throw(404, "League Not Found");
      }
      return { data: statis }

    },

  };
});

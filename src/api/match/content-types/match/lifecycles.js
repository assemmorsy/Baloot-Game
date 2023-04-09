const { ApplicationError } = require("@strapi/utils").errors;
module.exports = {

    beforeCreate(event) {

        let data = event.params.data;

        if (data.team_1.connect.length == 0 || data.team_2.connect.length == 0) {

            throw new ApplicationError("You Must Enter Two Teams")
        }
        if (data.team_1.connect[0].id == data.team_2.connect[0].id) {

            throw new ApplicationError("The Two Teams Must Be Different")
        }
    },

<<<<<<< HEAD
    beforeUpdate(event) {
        // let data = event.params.data;
        // if (data.team_1 || data.team_2 || data.team_1 === data.team_2) {

        //     throw new ApplicationError("consider it a UI Error :D")
        // }
=======
    async beforeUpdate(event) {
        let params = event.params;
        let matchId = params.where.id;

        let match = await strapi.entityService.findOne("api::match.match", matchId, {
            populate: {
                team_1: {
                    fields: ["id"],
                },
                team_2: {
                    fields: ["id"],
                },
            },
        })
        // the user erased the team 1
        if (params.data.team_1.disconnect.length !== 0 && params.data.team_1.connect.length == 0) {
            throw new ApplicationError("you must choose team 1")
        }
        // the user erased the team 2
        if (params.data.team_2.disconnect.length !== 0 && params.data.team_2.connect.length == 0) {
            throw new ApplicationError("you must choose team 1")
        }
>>>>>>> 27d6e6ef5310be05d36e0926859a4bb9aee0208f

        // the user updated team 1 with same value as team 2
        if (params.data.team_1.connect.length !== 0) {

            if (params.data.team_1.connect[0].id == match.team_2.id) {

                throw new ApplicationError("Team 1 cann't be the same as team 2")
            }
        }
        // the user updated team 2 with same value as team 1
        if (params.data.team_2.connect.length !== 0) {
            if (params.data.team_2.connect[0].id == match.team_1.id) {

                throw new ApplicationError("Team 2 cann't be the same as team 1")

            }
        }

    }

}
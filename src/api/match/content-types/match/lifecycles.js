// const { beforeCreate } = require("../../../player/content-types/player/lifecycles");
const { ApplicationError } = require("@strapi/utils").errors;
module.exports = {

    beforeCreate(event) {
        let data = event.params.data;
        if (data.team_1 || data.team_2 || data.team_1 === data.team_2) {

            throw new ApplicationError("consider it a UI Error :D")
        }
    },

    beforeUpdate(event) {
        let data = event.params.data;
        if (data.team_1 || data.team_2 || data.team_1 === data.team_2) {

            throw new ApplicationError("consider it a UI Error :D")
        }

        // this part is being handled in the amin panel 
        // using the deafult value = 0

        // let data = event.params.data;
        // if (data.state === "مباشر") {
        //     data.team1_score = 0,
        //     data.team2_score = 0,
        //     console.log(event.data)
        // };

    },


}
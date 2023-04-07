// const { beforeCreate } = require("../../../player/content-types/player/lifecycles");
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

    beforeUpdate(event) {
        let data = event.params.data;

        // console.log("team1")
        // console.log(data.team_1)
        // console.log("team2")
        // console.log(data.team_2)
        if (data.team_1.connect.length == 0 || data.team_2.connect.length == 0) {
            throw new ApplicationError("You Must Enter Two Teams")
            
        }
        if (data.team_1.connect[0].id == data.team_2.connect[0].id) {
           
            throw new ApplicationError("The Two Teams Must Be Different")
        }
        // this part is being handled in the admin panel 
        // using the deafult value = 0

        // let data = event.params.data;
        // if (data.state === "مباشر") {
        //     data.team1_score = 0,
        //     data.team2_score = 0,
        //     console.log(event.data)
        // };

    },


}
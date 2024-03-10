/**
 * match-estimation controller
 */

import { factories } from '@strapi/strapi'

interface createEstimationBody{
    winner_team: number,
    best_player:number ,
    user: number,
    match: number,
    countOf400: number,
    countOfKaboots: number,
    countOfRedCards: number,
    loserScore: number
}
export default factories.createCoreController('api::match-estimation.match-estimation',({strapi})=>{
    return {
        async create(ctx){
            const { id } = ctx.state.user;
            const requestBody = ctx.request.body.data as createEstimationBody;
            ctx.request.body.data.user = id;
            if(requestBody.winner_team === null || requestBody.best_player === null || requestBody.user === null || requestBody.match === null ) 
                return ctx.badRequest("invalid body input" ,{code : "InvalidBodyInput", message: "احد البيانات غير مرفقة"});
            
            // if(requestBody.user !== id ) return ctx.badRequest("invalid operation for this user" ,{code : "InvalidUserope", message: "هذا المستخدم غير مسجل"});

            const match = await strapi.entityService.findOne('api::match.match',requestBody.match, {
                fields: ["end_estimations", "start_estimations" ]
            });

            const currentDate = new Date();

            if(!match || !match.start_estimations || !match.end_estimations || currentDate < new Date(match.start_estimations) || currentDate > new Date(match.end_estimations))
                return ctx.badRequest("match is not open for estimation" ,{code : "InvalidOperationOnMatch", message: "هذه المباراة غير متاحة لاستقبال التوقعات"});

            const match_estimations = await strapi.entityService.findMany("api::match-estimation.match-estimation",{
                filters:{
                    $and:[
                        {match : {id : requestBody.match }},
                        {user : {id : id }}
                    ]
                }
            });
            if (match_estimations.length !== 0 )return ctx.badRequest("user already submit the estimation for this match" , {code : "InvalidOperationOnMatch", message: "لقد تم استلام توقعك لهذه المباراة بالفعل "});

            const res = await super.create(ctx);
            return res ;
        }
    }
});

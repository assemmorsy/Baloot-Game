module.exports = (plugin) => {
    plugin.controllers.user.SendOtpUsingQydha = async (ctx) => {
        let body = ctx.request.body;
        if(!body.username || !body.username.trim()) 
        return ctx.badRequest("username is required" , {code : "InvalidBodyInput", message: "اسم المستخدم حقل مطلوب"}) 
             
        let token = process.env.QYDHA_TOKEN 
        try{
            const response  = await fetch(`${process.env.QYDHA_API_URL}/auth/login-with-qydha`, {
                method: "POST",
                body : JSON.stringify({username : body.username}),
                headers: {Authorization: `Bearer ${token}` , 'Content-Type': 'application/json'}
            })
            const data = await response.json();
            if(!response.status.toString().startsWith("2")) 
                return ctx.badRequest("Error in sending otp from qydha." , data)
            return { RequestId : data.data.id}           
        }catch (err){
            console.error(err);
            throw err ; // return ctx.badRequest("error in sending notification." , err.message)
        }
    }   

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/send-otp-using-qydha',
        handler: 'user.SendOtpUsingQydha'
    });

    plugin.controllers.user.qydhaLoginWithOtp = async (ctx) => {
        let body = ctx.request.body;
        if(!body.RequestId || !body.RequestId.trim()) 
            return ctx.badRequest("requestId is required" , {code : "InvalidBodyInput", message: "رقم الطلب حقل مطلوب"}) 
        if(!body.Otp || !body.Otp.trim()) 
            return ctx.badRequest("Otp is required" , {code : "InvalidBodyInput", message: "رمز المرور حقل مطلوب"}) 
        let token = process.env.QYDHA_TOKEN 
        try{
            const response  = await fetch(`${process.env.QYDHA_API_URL}/auth/confirm-login-with-qydha`, {
                method: "POST",
                body : JSON.stringify({RequestId : body.RequestId ,otp : body.Otp }),
                headers: {Authorization: `Bearer ${token}` , 'Content-Type': 'application/json'}
            })
            const data = await response.json();

            if(!response.status.toString().startsWith("2")) 
                return ctx.badRequest("Error in sending otp from qydha." , data)
            let qydhaUser = data.data.user; 
            let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                where:{qydha_id : qydhaUser.id}
            })
            if(!user){
                ctx.request.body =  {
                    username:  qydhaUser.username,
                    email: qydhaUser.email ?? `${qydhaUser.id}@zat.com`,
                    password: `${qydhaUser.phone}${process.env.PASSWORD_SALT}`,
                    qydha_Id : qydhaUser.id ,
                    phone : qydhaUser.phone ,
                    avatar_url :qydhaUser.avatarUrl ,
                    name : qydhaUser.name 
                }
                return await strapi.plugin("users-permissions").controllers.auth.register(ctx);
            }else{
                ctx.request.body =  {
                    identifier: qydhaUser.username,
                    password: `${qydhaUser.phone}${process.env.PASSWORD_SALT}`
                }
                return await strapi.plugin("users-permissions").controllers.auth.callback(ctx);
            }
        }catch (err){
            console.error(err);
            throw err ;// return ctx.badRequest("error in sending notification." , err.message)
        }
    }

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/qydha-login',
        handler: 'user.qydhaLoginWithOtp'
    });
    return plugin;
}
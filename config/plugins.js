
module.exports = ({ env }) => ({
    upload: {
        config: {
            sizeLimit: 250 * 1024 * 1024 // 256mb in bytes
        }
    },
    //! TODO  remove the limit
    'users-permissions' : {
        config:{
            ratelimit:{ interval: 60000, max: 100000 }
        }
    }
});
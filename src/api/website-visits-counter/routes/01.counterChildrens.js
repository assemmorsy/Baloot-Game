'use strict';

/**
 * website-visits-counter router
 */

module.exports = {
    routes: [
        
        {
            method: "post",
            path: "/website-visits-counter",
            handler: "website-visits-counter.addOne",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

    ]
}
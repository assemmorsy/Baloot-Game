'use strict';

/**
 * match router
 */

module.exports = {
    routes: [

        {
            method: "POST",
            path: "/add-one-to-website-counter",
            handler: "website-visits-counter.addOneToWebsiteCounter",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },

    ]
}
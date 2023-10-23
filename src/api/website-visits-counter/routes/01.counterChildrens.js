'use strict';

/**
 * match router
 */

module.exports = {
    routes: [

        {
            method: "POST",
            path: "/website-visits-counter/add-one",
            handler: "website-visits-counter.addOneToWebsiteCounter",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ]
}
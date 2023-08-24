'use strict';

/**
 * referee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::referee.referee', ({ strapi }) => {
    return {
        async find(ctx) {
            try {
                let refereesData = await strapi.db.connection.raw(`
                select r.id , r.name , r.start_refereeing_at ,fr.formats -> 'thumbnail' ->> 'url' as image , count(*)  as refereed_matches_count
                from matches m
                join matches_referees_links mrl on mrl.match_id = m.id
                join referees r on r.id = mrl.referee_id
                join files_related_morphs frmr on frmr.related_id = r.id
                join files fr on frmr.file_id = fr.id
                where frmr.related_type = 'api::referee.referee' 
                group by (r.id , r.name , r.start_refereeing_at , fr.formats)
                `)
                return { referees: [...refereesData.rows] }
            } catch (error) {
                console.error(error);
                return { error_text: "error in fetching data from db" }
            }

        }
    }
});

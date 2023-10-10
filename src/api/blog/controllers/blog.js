'use strict';

/**
 * blog controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog',
    ({ strapi }) => {
        return {
            async find(ctx) {
                try {
                    let pgSize = strapi.requestContext.get().query.pgSize;
                    let pgNum = strapi.requestContext.get().query.pgNum;
                    if (!pgSize || isNaN(pgSize)) pgSize = 5
                    pgSize = parseInt(pgSize);
                    if (!pgNum || isNaN(pgNum)) pgNum = 1
                    pgNum = parseInt(pgNum);

                    const blogsDate = await strapi.db.connection.raw(`
                        select b.id , b.title, b.description , b.published_at , fb.url as image
                        from blogs b
                        left join files_related_morphs frmb on frmb.related_id = b.id
                        left join files fb on frmb.file_id = fb.id
                        where frmb.related_type = 'api::blog.blog' and b.published_at is not null
                        order by b.published_at desc
                        OFFSET ${(pgNum - 1) * pgSize} limit ${pgSize};
                    `)
                    const blogsTotalCount = await strapi.db.connection.raw(`
                            select count(*) as count from  blogs  where  published_at is not null ; 
                        `)
                    return { blogs: [...blogsDate.rows], totalCount: blogsTotalCount.rows[0].count }
                } catch (error) {
                    console.error(error);
                    return { error_text: "error in fetching data from db" }
                }

            }, async findOne(ctx) {
                let blogId = strapi.requestContext.get().params.id;
                if (!blogId || isNaN(blogId)) {
                    ctx.throw(400, "Invalid Team Id");
                }
                try {
                    const blogData = await strapi.db.connection.raw(`
                        select  b.id , b.title, b.description , b.published_at , fb.url as image , b.details
                        from blogs b
                        left join files_related_morphs frmb on frmb.related_id = b.id
                        left join files fb on frmb.file_id = fb.id
                        where frmb.related_type = 'api::blog.blog' and b.id = ${blogId}  ; 
                    `)
                    if (blogData.rows.length !== 1) ctx.throw(404, "Blog Not Found");

                    return { data: blogData.rows[0] }
                } catch (error) {
                    console.error(error);
                    return { error_text: "error in fetching data from db" }
                }
            }
        }
    });

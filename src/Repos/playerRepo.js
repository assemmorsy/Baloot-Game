const getPlayerById = async (playerId) => {
    try {
        let playerData = await strapi.db.connection.raw(`
            select  p.id as player_id , p.name as player_name , p.twitter_link , p.snap_link , p.tiktok_link , 
            fp.formats -> 'medium' ->> 'url' as player_image
            from players p 
            inner join files_related_morphs frmp on frmp.related_id = p.id
            inner join files fp on frmp.file_id = fp.id
            where p.id = ${playerId}  and  frmp.related_type = 'api::player.player'
        `)
        return playerData.rows.length === 1 ? playerData.rows[0] : -1
    } catch (error) {
        console.error(error);
    }
}

const getPlayerTransfersById = async (playerId) => {
    try {
        let playerTransfers = await strapi.db.connection.raw(`
        select pt.transfered_at , ft.name as from_team_name ,ftf.formats -> 'thumbnail' ->> 'url' as from_team_logo ,
        p.id as player_id, p.name ,fp.formats -> 'thumbnail' ->> 'url' as image,
        tt.name as to_team_name ,ttf.formats -> 'thumbnail' ->> 'url' as to_team_logo 
        from player_transfers pt
        left join player_transfers_from_team_links ftl on ftl.player_transfer_id = pt.id
        left join teams ft on ft.id = ftl.team_id 
        left join player_transfers_to_team_links ttl on ttl.player_transfer_id = pt.id
        left join teams tt on tt.id = ttl.team_id
        inner join player_transfers_player_links pl on pl.player_transfer_id = pt.id
        inner join players p on p.id = pl.player_id
    
        inner join files_related_morphs frmp on frmp.related_id = p.id
        inner join files fp on frmp.file_id = fp.id
    
        left join files_related_morphs frmft on frmft.related_id = ft.id
        left join files ftf on frmft.file_id = ftf.id
    
        left join files_related_morphs frmtt on frmtt.related_id = tt.id
        left join files ttf on frmtt.file_id = ttf.id
    
        where (p.id = ${playerId}) and frmp.related_type = 'api::player.player' and
        (frmft.related_type = 'api::team.team' or frmft.related_type is null)
        and (frmtt.related_type = 'api::team.team' or frmtt.related_type is null)
        order by pt.transfered_at  desc;
        `)
        return playerTransfers.rows
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getPlayerById
    , getPlayerTransfersById
}
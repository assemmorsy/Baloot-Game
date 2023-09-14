select ptpl.player_id as id,
    p.name,
    fp.formats->'thumbnail'->>'url' as image
from player_transfers pt
    join player_transfers_to_team_links ptttl on ptttl.player_transfer_id = pt.id
    join player_transfers_player_links ptpl on ptpl.player_transfer_id = pt.id
    join players p on p.id = ptpl.player_id
    inner join files_related_morphs frmp on frmp.related_id = p.id
    inner join files fp on frmp.file_id = fp.id
where frmp.related_type = 'api::player.player'
    and ptttl.team_id = 2
    and pt.transfered_at < '2023-07-01'
EXCEPT
select ptpl.player_id,
    p.name,
    fp.formats->'thumbnail'->>'url' as image
from player_transfers pt
    join player_transfers_from_team_links ptftl on ptftl.player_transfer_id = pt.id
    join player_transfers_player_links ptpl on ptpl.player_transfer_id = pt.id
    join players p on p.id = ptpl.player_id
    inner join files_related_morphs frmp on frmp.related_id = p.id
    inner join files fp on frmp.file_id = fp.id
where frmp.related_type = 'api::player.player'
    and ptftl.team_id =
    and ptttl.team_id = 2
    and pt.transfered_at < '2023-07-01';
import { Player } from '@engine/world/actor';
import { PacketData } from '@engine/net';

const magicOnItemPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const interfaceSet = buffer.get('int', 'u', 'le');
    const toSlot = buffer.get('int', 'u', 'me2');
    const itemId = buffer.get('short', 'u', 'be');
    const itemSlot = buffer.get('short', 'u', 'be');

    const interfaceId = interfaceSet >> 16;
    const idk = interfaceSet >> 16;

    console.log("magic on item packet ", interfaceSet, interfaceId, idk, toSlot, itemId, itemSlot);
    for (var i = 0; i < 32; i++)
        console.log((interfaceSet | interfaceId) >> i);


    // if(toSlot < 0 || fromSlot < 0) {
    //     return;
    // }

    // if(swapType === 0) {
    //     player.actionPipeline.call('item_swap', player, fromSlot, toSlot, { widgetId, containerId })
    // } else if(swapType === 1) {
    //     player.actionPipeline.call('move_item', player, fromSlot, toSlot, { widgetId, containerId })
    // }
};

export default {
    opcode: 21,
    size: 12,
    handler: magicOnItemPacket
}

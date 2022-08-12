import { Player } from '@engine/world/actor';
import { PacketData } from '@engine/net';

const magicOnItemPacket = (player: Player, packet: PacketData) => {
    const { buffer } = packet;
    const interfaceSet = buffer.get('int', 'u', 'le');  // This contains the Player's Magic interface and spell Id
    const interfaceSet2 = buffer.get('int', 'u', 'le'); // This only contains the Player's Inventory Interface
    const itemId = buffer.get('short', 'u', 'be');
    const itemSlot = buffer.get('short', 'u', 'be');

    const spellbookWidgetId = interfaceSet >> 16;
    const inventoryWidgetId = interfaceSet2 >> 16;

    const spellId = interfaceSet & 0x0000FFFF;

    //player.sendMessage("Magic On Item " + spellbookWidgetId + " " + spellId + " " + inventoryWidgetId  + " " + itemId + " " + itemSlot);

    if(itemSlot < 0) {
        return;
    }

    if (!player.inventory.has(itemId)) {
        return;
    }

    player.actionPipeline.call('magic_on_item', player, itemId, spellbookWidgetId, spellId,);

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

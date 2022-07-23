import { Player } from "@engine/world/actor";
import { ActionPipe } from "../action-pipeline";
import { ActionHook, getActionHooks } from "../hook/action-hook";


export interface MagicOnItemActionHook extends ActionHook<MagicOnItemAction, magicOnItemActionHandler> {
    itemId: number;
    widgetId: number;
    spellId: number;
    cancelActions? : boolean;
}

export type magicOnItemActionHandler = (magicOnItemAction ) => void | Promise<void>;

export interface MagicOnItemAction {
    player: Player;
    itemId: number;
    widgetId: number;
    spellId: number;
}

const magicOnItemActionPipe = (player: Player, itemId: number, widgetId: number, spellId: number) => {

    const matchingHooks = getActionHooks<MagicOnItemActionHook>('magic_on_item');

    if(matchingHooks.length === 0) {
        player.outgoingPackets.chatboxMessage(`Unhandled spell: ${widgetId}:${spellId}`);
        return null;
    }

    return {
        hooks: matchingHooks,
        action: {
            player,
            itemId,
            widgetId,
            spellId
        }
    }
}

export default [ 'magic_on_item', magicOnItemActionPipe ] as ActionPipe;
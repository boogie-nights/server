import { Player } from "@engine/world/actor";
import { ActionPipe, RunnableHooks, ActionHook, getActionHooks, advancedNumberHookFilter } from '@engine/action';
import { ItemDetails } from "@engine/config";


export interface MagicOnItemActionHook extends ActionHook<MagicOnItemAction, magicOnItemActionHandler> {
    widgetId?: number;
    widgetIds?: number[];
    spellIds?: number[];
    cancelActions? : boolean;
}

export type magicOnItemActionHandler = (magicOnItemAction ) => void | Promise<void>;

export interface MagicOnItemAction {
    player: Player;
    item: number;
    widgetId: number;
    spellId: number;
}

const magicOnItemActionPipe = (player: Player, item: number, widgetId: number, spellId: number): RunnableHooks<MagicOnItemAction> => {

    const matchingHooks = getActionHooks<MagicOnItemActionHook>('magic_on_item');
    
    if(matchingHooks.length === 0) {
        player.outgoingPackets.chatboxMessage(`Unhandled spell: ${widgetId}:${spellId}`);
        return null;
    }

    return {
        hooks: matchingHooks,
        action: {
            player,
            item,
            widgetId,
            spellId
        }
    }
}

export default [ 'magic_on_item', magicOnItemActionPipe ] as ActionPipe;
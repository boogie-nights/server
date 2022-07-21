import { itemInteractionActionHandler } from '@engine/action/pipe/item-interaction.action';
import { Player, SidebarTab } from '@engine/world/actor/player/player';
import { dialogue, execute } from '@engine/world/actor/dialogue';
import { getActionHooks } from '@engine/action/hook';
import { advancedNumberHookFilter } from '@engine/action/hook/hook-filters';
import { ObjectInteractionActionHook } from '@engine/action/pipe/object-interaction.action';
import { objectIds } from '@engine/world/config/object-ids';
import { openTravel } from '@plugins/items/rotten-potato/helpers/rotten-potato-travel';


function openBank(player: Player) {
    const interactionActions = getActionHooks<ObjectInteractionActionHook>('object_interaction')
        .filter(plugin => advancedNumberHookFilter(plugin.objectIds, objectIds.bankBooth, plugin.options, 'use-quickly'));
    interactionActions.forEach(plugin =>
        plugin.handler({
            player: player,
            object: {
                objectId: objectIds.bankBooth,
                level: player.position.level,
                x: player.position.x,
                y: player.position.y,
                orientation: 0,
                type: 0
            },
            objectConfig: undefined,
            option: 'use-quickly',
            position: player.position,
            cacheOriginal: undefined
        }));
}

function swapSpellBook(player: Player, spellbookId: number): void {
    player.setSidebarWidget(SidebarTab.MAGIC, spellbookId);
    player.outgoingPackets.blinkTabIcon(6);
}

enum DialogueOption {
    BANK,
    TELEPORT_MENU,
    TELEPORT_TO_RARE_DROP,
    FORCE_RARE_DROP,
    SWAP_SPELLBOOK_MODERN,
    SWAP_SPELLBOOK_ANCIENT,
    SWAP_SPELLBOOK_LUNAR
}

const peelPotato: itemInteractionActionHandler = async (details) => {

    let chosenOption: DialogueOption;
    // console.log(world.travelLocations.locations)
    await dialogue([details.player], [
        options => [
            `Bank menu`, [
                execute(() => chosenOption = DialogueOption.BANK)
            ],
            `Travel Far!`, [
                execute(() => chosenOption = DialogueOption.TELEPORT_MENU)
            ],
            `Modern Magic`, [
                execute(() => chosenOption = DialogueOption.SWAP_SPELLBOOK_MODERN)
            ],
            `Ancient Magic`, [
                execute(() => chosenOption = DialogueOption.SWAP_SPELLBOOK_ANCIENT)
            ],
            `Lunar Magic`, [
                execute(() => chosenOption = DialogueOption.SWAP_SPELLBOOK_LUNAR)
            ],
            // `Teleport to RARE!`, [
            //     execute(() => chosenOption = DialogueOption.TELEPORT_TO_RARE_DROP)
            // ],
            // `Spawn RARE!`, [
            //     execute(() => chosenOption = DialogueOption.FORCE_RARE_DROP)
            // ],
        ]
    ]);
    switch (chosenOption) {
        case DialogueOption.BANK:
            openBank(details.player);
            break;
        case DialogueOption.TELEPORT_MENU:
            openTravel(details.player, 1);
            break;
        case DialogueOption.SWAP_SPELLBOOK_MODERN:
            swapSpellBook(details.player, 192);
            break;
        case DialogueOption.SWAP_SPELLBOOK_ANCIENT:
            swapSpellBook(details.player, 193);
            break;
        case DialogueOption.SWAP_SPELLBOOK_LUNAR:
            swapSpellBook(details.player, 430);
            break;
        default:
            break;
    }

};

export default peelPotato;

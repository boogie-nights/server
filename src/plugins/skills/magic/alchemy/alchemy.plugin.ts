import { TaskExecutor } from "@engine/action/hook/task";
import { MagicOnItemAction, MagicOnItemActionHook } from "@engine/action/pipe/magic-on-item.action";
import { findItem } from "@engine/config/config-handler";
import { Skill } from "@engine/world/actor/skills";
import { Item } from "@engine/world/items/item";
import _ from "lodash";
import { checkForStaff, FIRE_RUNE, hasRunes, NATURE_RUNE, removeRunes } from "../magic-util";
import { MODERN_SPELLBOOK } from "../teleportation/teleportation-constants";

interface AlchemySpell {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    graphicId: number;
    animationId: number;
    soundEffectId: number;
}

const LOW_LEVEL_ALCHEMY: AlchemySpell = {
    requiredLevel: 21, 
    requiredItems: [
        { itemId: FIRE_RUNE.gameId, amount: 3 },
        { itemId: NATURE_RUNE.gameId, amount: 1 },
    ],
    experience: 31,
    graphicId: 112,
    animationId: 712,
    soundEffectId: 98
}

const HIGH_LEVEL_ALCHEMY: AlchemySpell = {
    requiredLevel: 55, 
    requiredItems: [
        { itemId: FIRE_RUNE.gameId, amount: 5 },
        { itemId: NATURE_RUNE.gameId, amount: 1 },
    ],
    experience: 65,
    graphicId: 113,
    animationId: 713,
    soundEffectId: 97
}

const getSpell = (buttonId) => {
    switch(buttonId) {
        case 10:
            return LOW_LEVEL_ALCHEMY;
        case 26:
            return HIGH_LEVEL_ALCHEMY;
    }
}

const canActivate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell = getSpell(actionData.spellId);
    
    task.session.spell = spell;

    player.interfaceState.closeAllSlots();

    if (taskIteration === 0) {
        if (player.interfaceState.findWidget(actionData.widgetId)) {
            return false;
        }

        if (player.skills.getLevel(Skill.MAGIC) < spell.requiredLevel) {
            player.sendMessage("Your Magic level is not high enough for this spell.");
            return false;
        }

        const staffType = checkForStaff(player);
        task.session.staffType = staffType;

        if (!hasRunes(player, spell.requiredItems, staffType)) {
            player.sendMessage("You do not have the required items for this spell.");
            return false;
        }

        if (actionData.item === FIRE_RUNE.gameId || actionData.item === NATURE_RUNE.gameId) {
            let spellCopy = _.cloneDeep(spell.requiredItems);
            let newRequiredItems = spellCopy.map(item => {
                if (item.itemId === actionData.item) {
                    item.amount += 1;
                }
                return {
                    ...item
                };
            })
            
            if (!hasRunes(player, newRequiredItems, staffType)) {
                player.sendMessage("You do not have the required items for this spell.");
                return false;
            }
        }
        
        if (actionData.item === 995) {
            player.sendMessage("Coins are already made of gold.");
            return false;
        }
    }
    
    return true;
}

const activate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell = task.session.spell;
    const staffType = task.session.staffType;

    if (taskIteration === 0) {
        removeRunes(player, spell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, spell.experience);
        player.playAnimation(spell.animationId);
        player.playGraphics({ id: spell.graphicId, height: 90 });
        player.playSound(spell.soundEffectId);

        player.outgoingPackets.sendSwitchTab(6);

        let item = findItem(actionData.item);
        player.inventory.removeMany(actionData.item, 1);

        let amountOfCoins = spell === LOW_LEVEL_ALCHEMY ? item.lowAlchValue : item.highAlchValue;
        player.inventory.add({itemId: 995, amount: amountOfCoins});
    }

    if (taskIteration === 2 && spell === LOW_LEVEL_ALCHEMY) {
        return false;
    }

    if (taskIteration === 4) {
        return false;
    }

    return true;
}

export default {
    pluginId: "rs:alchemy",
    hooks: [
        {
            type: "magic_on_item",
            widgetId: MODERN_SPELLBOOK.widgetId,
            spellIds: [10, 26],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as MagicOnItemActionHook
    ]
}

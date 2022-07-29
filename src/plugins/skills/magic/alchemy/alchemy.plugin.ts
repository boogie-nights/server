// Low level alchemy info
// Animation = 712
// GFX = 112
// Sound Effect = 98

import { TaskExecutor } from "@engine/action/hook/task";
import { MagicOnItemAction, MagicOnItemActionHook } from "@engine/action/pipe/magic-on-item.action";
import { findItem, widgets } from "@engine/config/config-handler";
import { ItemDetails } from "@engine/config/item-config";
import { Skill } from "@engine/world/actor/skills";
import { Item } from "@engine/world/items/item";
import { action } from "@plugins/dialogue/dialogue-option.plugin";
import { checkForStaff, hasRunes, removeRunes } from "../magic-util";

// Low level alchemy info
// Animation = 713
// GFX = 113
// Sound Effect = 97

// when trying to alch gold = "Coins are already made of gold."

interface AlchemySpell {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    graphicId: number;
    animationId: number;
    soundEffectId: number;
}

const BANANA = 1963;
const PEACH = 6883;

const LOW_LEVEL_ALCHEMY: AlchemySpell = {
    requiredLevel: 21, 
    requiredItems: [
        { itemId: 554, amount: 3 },
        { itemId: 561, amount: 1 },
    ],
    experience: 31,
    graphicId: 112,
    animationId: 712,
    soundEffectId: 98
}

const HIGH_LEVEL_ALCHEMY = {
    requiredLevel: 55, 
    requiredItems: [
        { itemId: 554, amount: 5 },
        { itemId: 561, amount: 1 },
    ],
    experience: 65,
    graphicId: 113,
    animationId: 713,
    soundEffectId: 97
}

const bones = [ 526 ];

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

    if (taskIteration === 3 && spell === LOW_LEVEL_ALCHEMY) {
        return false;
    }

    if (taskIteration === 5) {
        return false;
    }

    return true;
}

export default {
    pluginId: "rs:alchemy",
    hooks: [
        {
            type: "magic_on_item",
            widgetId: 192,
            spellId: [10, 26],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as MagicOnItemActionHook
    ]
}

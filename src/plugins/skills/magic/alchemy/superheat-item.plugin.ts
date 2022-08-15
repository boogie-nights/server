import { ButtonAction, ButtonActionHook, MagicOnItemAction, MagicOnItemActionHook, TaskExecutor } from "@engine/action";
import { findItem } from "@engine/config";
import { Player } from "@engine/world/actor/player/player";
import { Skill } from "@engine/world/actor/skills";
import { Item } from "@engine/world/items/item";
import { checkForStaff, FIRE_RUNE, hasRunes, NATURE_RUNE, removeRunes } from "../magic-util";
import { MODERN_SPELLBOOK } from "../teleportation/teleportation-constants";

interface SuperheatSpellData {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    successGraphicId: number;
    failureGraphicId: number;
    animationId: number;
    soundId: number;
}

const SUPERHEAT_ITEM: SuperheatSpellData = {
    requiredLevel: 43, 
    requiredItems: [
        { itemId: FIRE_RUNE.gameId, amount: 4 },
        { itemId: NATURE_RUNE.gameId, amount: 1 }
    ],
    experience: 53,
    successGraphicId: 148,
    failureGraphicId: 85,
    animationId: 725,
    soundId: 190
}

const getSpell = (buttonId) => {
    switch(buttonId) {
        case 21:
            return SUPERHEAT_ITEM;
    }
}

interface BarData {
    requiredLevel: number;
    experience: number;
    requiredItems: Item[];
    output: number;
}

const BRONZE_BAR: BarData = {
    requiredLevel: 1,
    experience: 6.2,
    requiredItems: [
        { itemId: 436, amount: 1 },
        { itemId: 438, amount: 1 }
    ],
    output: 2349
};

const BLURITE_BAR: BarData = {
    requiredLevel: 13,
    experience: 8,
    requiredItems: [
        { itemId: 668, amount: 1 }
    ],
    output: 9467
};

const IRON_BAR: BarData = {
    requiredLevel: 15,
    experience: 12.5,
    requiredItems: [
        { itemId: 440, amount: 1 }
    ],
    output: 2351
};

const SILVER_BAR: BarData = {
    requiredLevel: 20,
    experience: 13.7,
    requiredItems: [
        { itemId: 442, amount: 1 }
    ],
    output: 2355
};

const STEEL_BAR: BarData = {
    requiredLevel: 30,
    experience: 17.5,
    requiredItems: [
        { itemId: 440, amount: 1 },
        { itemId: 453, amount: 2 }
    ],
    output: 2353
};

const GOLD_BAR: BarData = {
    requiredLevel: 40,
    experience: 22.5,
    requiredItems: [
        { itemId: 444, amount: 1 }
    ],
    output: 2357
};

const PERFECT_GOLD_BAR: BarData = {
    requiredLevel: 40,
    experience: 22.5,
    requiredItems: [
        { itemId: 446, amount: 1 }
    ],
    output: 2365
};

const MITHRIL_BAR: BarData = {
    requiredLevel: 50,
    experience: 30,
    requiredItems: [
        { itemId: 447, amount: 1 },
        { itemId: 453, amount: 4 }
    ],
    output: 2359
};

const ADAMANT_BAR: BarData = {
    requiredLevel: 70,
    experience: 37.5,
    requiredItems: [
        { itemId: 449, amount: 1 },
        { itemId: 453, amount: 6 }
    ],
    output: 2361
};

const RUNE_BAR: BarData = {
    requiredLevel: 85,
    experience: 50,
    requiredItems: [
        { itemId: 451, amount: 1 },
        { itemId: 453, amount: 8 }
    ],
    output: 2363
};

const bars = new Map<number, BarData>([
    [668, BLURITE_BAR],
    [442, SILVER_BAR],
    [444, GOLD_BAR],
    [444, PERFECT_GOLD_BAR],
    [447, MITHRIL_BAR],
    [449, ADAMANT_BAR],
    [451, RUNE_BAR],
]);

const GOLD_SMITHING_GAUNTLETS = 776;

const ores: number[] = [ 436, 438, 440, 442, 444, 447, 449, 451, 668, 446 ];

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const hasRequiredOres = (player: Player, barData: BarData): boolean => {
    let hasAllItems = true;
    barData.requiredItems.forEach(item => {
        let itemIndex = player.inventory.findIndex(item);
        if (itemIndex === -1 || player.inventory.amount(item.itemId) < item.amount) {
            hasAllItems = false;
        }       
    });
    return hasAllItems;
}

const convertOnesToWords = (num: number) => {
    if (num === 0) return "zero";
    else return ones[num];
}

const calculateSmithingExp = (player: Player, bar: BarData): number => {
    return player.isItemEquipped(GOLD_SMITHING_GAUNTLETS) && (bar === GOLD_BAR || bar === PERFECT_GOLD_BAR) ? bar.experience * 2 : bar.experience; 
}

const canActivate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell: SuperheatSpellData = getSpell(actionData.spellId);
    
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

        if (actionData.item === 2892) {
            player.sendMessage("Even this spell is not hot enough to heat this item.");
            return false;
        }

        if (!ores.some(item => item === actionData.item)) {
            player.sendMessage("You need to cast superheat item on ore.");
            player.playGraphics({ id: spell.failureGraphicId, height: 90 });
            player.playSound(191);
            return false;
        }

        let barToSmelt = determineBar(player, actionData.item);
        task.session.barToSmelt = barToSmelt;

        if (player.skills.getLevel(Skill.SMITHING) < barToSmelt.requiredLevel) {
            const itemName = findItem(actionData.item).name
            player.sendMessage(`You need a smithing level of at least ${barToSmelt.requiredLevel} to smelt ${itemName.substring(0, itemName.indexOf(' ')).toLowerCase()}.`);
            return false;
        }

        if (!hasRequiredOres(player, barToSmelt)) {
            const itemName = findItem(actionData.item).name
            if (barToSmelt === BRONZE_BAR) {
                player.sendMessage("You need one copper ore and one tin ore to make bronze.");
            } else {
                const coalIndex = barToSmelt.requiredItems.findIndex(item => item.itemId === 453);
                player.sendMessage(`You need ${convertOnesToWords(barToSmelt.requiredItems[coalIndex].amount)} heaps of coal to smelt ${itemName.substring(0, itemName.indexOf(' ')).toLowerCase()}.`);
            }
            return false;
        }
    }
    return true;
}

const determineBar = (player: Player, itemId: number): BarData => {
    if (itemId === 436 || itemId === 438) {
        return BRONZE_BAR;
    } else if (itemId === 440) {
        if (player.inventory.findAll(453).length > 1) {
            return STEEL_BAR;
        } else {
            return IRON_BAR;
        }
    } else {
        return bars.get(itemId);
    }
}

const activate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player } = task.getDetails();

    const spell: SuperheatSpellData = task.session.spell;
    const staffType = task.session.staffType;
    const barToSmelt: BarData = task.session.barToSmelt;

    if (taskIteration === 0) {
        removeRunes(player, spell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, spell.experience);
        player.skills.addExp(Skill.SMITHING, calculateSmithingExp(player, barToSmelt));
        player.playAnimation(spell.animationId);
        player.playGraphics({ id: spell.successGraphicId, height: 90 });
        player.playSound(spell.soundId);

        player.outgoingPackets.sendSwitchTab(6);

        barToSmelt.requiredItems.forEach(item => player.inventory.removeMany(item.itemId, item.amount));
        player.inventory.add(barToSmelt.output);
    }

    if (taskIteration === 1) {
        return false;
    }
    return true;
}

export default {
    pluginId: "rs:superheat-item",
    hooks: [
        {
            type: "magic_on_item",
            widgetId: MODERN_SPELLBOOK.widgetId,
            spellIds: [21],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as MagicOnItemActionHook
    ]
}

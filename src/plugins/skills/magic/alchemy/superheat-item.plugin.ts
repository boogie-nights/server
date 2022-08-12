import { ButtonAction, ButtonActionHook, MagicOnItemAction, MagicOnItemActionHook, TaskExecutor } from "@engine/action";
import { Skill } from "@engine/world/actor/skills";
import { Item } from "@engine/world/items/item";
import { checkForStaff, hasRunes, removeRunes } from "../magic-util";

// Animation 725, Graphic 148, Sound Effect 190
// trying to cast on not ores = "You need to cast superheat item on ore." plays gfx 85 and sound 191
// trying to cast on elemental ore = "Even this spell is not hot enough to heat this item."
// unique error messages per item
// You need one copper ore and one tin ore to make bronze.
// You need four heaps of coal to smelt mithril.
// Level error message triggers first then missing ores-> You need a smithing level of at least 70 to smelt adamantite.



interface AlchemySpell {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    output: number;
}

const SUPERHEAT_ITEM: AlchemySpell = {
    requiredLevel: 15, 
    requiredItems: [
        { itemId: 557, amount: 2 },
        { itemId: 555, amount: 2 },
        { itemId: 561, amount: 1 },
    ],
    experience: 25,
    output: -1
}

const getSpell = (buttonId) => {
    switch(buttonId) {
        case 21:
            return SUPERHEAT_ITEM;
    }
}

const ores: number[] = [ 436, 438, 440, 442, 444, 447, 449, 451, 668, 446 ];

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

        if (!ores.some(item => item === actionData.item)) {
            player.sendMessage("You need to cast superheat item on ore.");
            player.playGraphics({ id: 85, height: 90 });
            player.playSound(191);
            return false;
        }
    }
    return true;
}

const activate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player } = task.getDetails();

    const spell = task.session.spell;
    const staffType = task.session.staffType;

    if (taskIteration === 0) {
        removeRunes(player, spell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, spell.experience);
        player.playAnimation(725);
        player.playGraphics({ id: 148, height: 90 });
        player.playSound(190);
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
            widgetId: 192,
            spellIds: [21],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as MagicOnItemActionHook
    ]
}

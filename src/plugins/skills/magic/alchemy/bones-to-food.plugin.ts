import { ButtonAction, ButtonActionHook, TaskExecutor } from "@engine/action";
import { Skill } from "@engine/world/actor/skills";
import { Item } from "@engine/world/items/item";
import { checkForStaff, hasRunes, removeRunes } from "../magic-util";

// Bones to Bananas Data
// No bones? -> Chatbox message "You aren't holding any bones!"
// Animation 722, Graphic 141, Sound Effect 114

// Bones to Peaches Data
// Spell not unlocked? Chatbox messaage "You can only learn this spell from the Mage Training Arena"
// No bones? -> Chatbox message "You aren't holding any bones!"
// Animation 722, Graphic 141, Sound Effect 114

// Background: In osrs big bones are included, but pre an update on May 23, 2013 it only worked on bones

interface AlchemySpell {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    output: number;
    // TODO MTA requirement... Probably SpellRequirements interface
}

const BANANA = 1963;
const PEACH = 6883;

const BONES_TO_BANANAS: AlchemySpell = {
    requiredLevel: 15, 
    requiredItems: [
        { itemId: 557, amount: 2 },
        { itemId: 555, amount: 2 },
        { itemId: 561, amount: 1 },
    ],
    experience: 25,
    output: BANANA
}

const BONES_TO_PEACHES = {
    requiredLevel: 60, 
    requiredItems: [
        { itemId: 557, amount: 4 },
        { itemId: 555, amount: 4 },
        { itemId: 561, amount: 2 },
    ],
    experience: 25,
    output: PEACH
}

const bones = [ 526 ];

const getSpell = (buttonId) => {
    switch(buttonId) {
        case 7:
            return BONES_TO_BANANAS;
        case 559:
            return BONES_TO_PEACHES;
    }
}

const canActivate = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell = getSpell(actionData.buttonId);
    
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
        
        let hasBones = bones.some(item => {
            let itemIndex = player.inventory.findItemIndex({itemId: item, amount: 1})
            return itemIndex !== -1;
        });

        if (!hasBones) {
            player.sendMessage("You aren't holding any bones!");
            return false;
        }
    }
    
    return true;
}

const activate = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player } = task.getDetails();

    const spell = task.session.spell;
    const staffType = task.session.staffType;

    if (taskIteration === 0) {
        removeRunes(player, spell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, spell.experience);
        player.playAnimation(722);
        player.playGraphics({ id: 141, height: 90 });
        player.playSound(114);
    }

    if (taskIteration === 1) {
        bones.forEach(item => {
            let theseBones = player.inventory.findAll(item);
            theseBones.forEach(item => {
                player.removeItem(item);
                player.giveItem(spell.output);
            });
        });
        return false;
    }
    return true;
}

export default {
    pluginId: "rs:bones-to-food",
    hooks: [
        {
            type: "button",
            widgetId: 192,
            buttonIds: [7, 559],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as ButtonActionHook
    ]
}

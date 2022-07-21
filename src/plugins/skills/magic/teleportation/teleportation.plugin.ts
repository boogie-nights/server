import { ButtonAction, ButtonActionHook, TaskExecutor } from "@engine/action";
import { randomBetween } from "@engine/util";
import { Skill } from "@engine/world/actor";
import { Position } from "@engine/world/position";
import { checkForStaff, hasRunes, removeRunes } from "../magic-util";
import { ANCIENT_SPELLBOOK, MODERN_SPELLBOOK } from "./teleportation-constants";
import { SpellBook, Teleport } from "./teleportation-types";

const canTeleport = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();
    
    const spellBook = determineSpellBook(actionData.widgetId);
    const teleportSpell = spellBook.teleportButtonIds.get(actionData.buttonId);

    task.session.spellBook = spellBook;
    task.session.teleportSpell = teleportSpell;

    player.interfaceState.closeAllSlots();

    if (taskIteration === 0) {
        if (player.interfaceState.findWidget(actionData.widgetId)) {
            return false;
        }

        if (player.skills.getLevel(Skill.MAGIC) < teleportSpell.requiredLevel) {
            player.sendMessage("Your Magic level is not high enough for this spell.");
            return false;
        }
        
        const staffType = checkForStaff(player);
        task.session.staffType = staffType;
    
        if (!hasRunes(player, teleportSpell.requiredItems, staffType)) {
            player.sendMessage("You do not have the required items for this spell.");
            return false;
        }

        if (teleportSpell.questRequirement) {
            const requiredQuest = player.quests.find(quest => quest.questId === teleportSpell?.questRequirement.questId);
            if (!requiredQuest?.complete) {
                player.sendMessage(`You must have completed ${teleportSpell.questRequirement.questName} to use this spell.`);
                return false;
            }
        }
    }
    return true;
}

const teleport = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player } = task.getDetails();

    const spellBook = task.session.spellBook;
    const teleportSpell = task.session.teleportSpell;
    const staffType = task.session.staffType;

    if (taskIteration === 0) {
        removeRunes(player, teleportSpell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, teleportSpell.experience);
        player.playAnimation(spellBook.teleportAnimationId);
        player.playGraphics(spellBook.teleportGraphicId);
        player.playSound(spellBook.teleportSoundEffectId);
    }

    if (taskIteration === 2) {
        player.teleport(new Position(determineTeleportLocation(teleportSpell)));
        task.actor.stopAnimation();
        task.stop();
        return false;
    }
    return true;
}

const determineSpellBook = (widgetId: number): SpellBook => {
    switch (widgetId) {
        case 192:
            return MODERN_SPELLBOOK;
        case 193:
            return ANCIENT_SPELLBOOK;
    }
}

// TODO: check if it's a valid position.
const determineTeleportLocation = (teleport: Teleport): Position => {

    let randomX, randomY, randomBoundaryIndex = 0;
    if (teleport.boundary.length === 1) {
        randomX = randomBetween(teleport.boundary[0].startX, teleport.boundary[0].endX);
        randomY = randomBetween(teleport.boundary[0].startY, teleport.boundary[0].endY);
    } else {
        let randomBoundaryIndex = randomBetween(0, teleport.boundary.length - 1) ;
        randomX = randomBetween(teleport.boundary[randomBoundaryIndex].startX, teleport.boundary[randomBoundaryIndex].endX);
        randomY = randomBetween(teleport.boundary[randomBoundaryIndex].startY, teleport.boundary[randomBoundaryIndex].endY);
    }

    let height = teleport.boundary[randomBoundaryIndex]?.height ? teleport.boundary[randomBoundaryIndex].height : 0;

    return new Position(randomX, randomY, height);
}

export default {
    pluginId: "rs:teleportation",
    hooks: [
        {
            type: "button",
            widgetIds: [ MODERN_SPELLBOOK.widgetId, ANCIENT_SPELLBOOK.widgetId ],
            buttonIds: Array.prototype.concat.apply([], [
                Array.from(MODERN_SPELLBOOK.teleportButtonIds.keys()), 
                Array.from(ANCIENT_SPELLBOOK.teleportButtonIds.keys())
            ]),
            task: {
                canActivate: canTeleport,
                activate: teleport,
                interval: 2
            }
        } as ButtonActionHook
    ]
};

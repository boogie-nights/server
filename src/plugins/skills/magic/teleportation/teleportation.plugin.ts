import { ButtonAction, ButtonActionHook, TaskExecutor } from "@engine/action";
import { randomBetween } from "@engine/util";
import { playerExists, Skill } from "@engine/world/actor";
import { Position } from "@engine/world/position";
import { standardSpellBookAnimationId, standardSpellBookGraphicId, standardSpellBookSoundId, standardSpellBookWidgetButtonIds, standardSpellBookWidgetId } from "./teleportation-constants";
import { Teleport } from "./teleportation-types";

const canTeleport = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();
    
    const teleportSpell = standardSpellBookWidgetButtonIds.get(actionData.buttonId);

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
    
        let hasAllItems = true;
        teleportSpell.requiredItems.forEach(item => {
            let itemIndex = player.inventory.findItemIndex(item);
            if (itemIndex === -1) {
                hasAllItems = false;
            }
        });
    
        if (!hasAllItems) {
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

    const teleportSpell = task.session.teleportSpell;

    if (taskIteration === 0) {
        teleportSpell.requiredItems.forEach(item => {
            player.removeItems(item.itemId, item.amount);
        });
        player.skills.addExp(Skill.MAGIC, teleportSpell.experience);
        player.playAnimation(standardSpellBookAnimationId);
        player.playGraphics(standardSpellBookGraphicId);
        player.playSound(standardSpellBookSoundId);
    }

    if (taskIteration === 2) {
        player.teleport(new Position(determineTeleportLocation(teleportSpell)));
        task.actor.stopAnimation();
        task.stop();
        return false;
    }
    return true;
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
            widgetIds: [standardSpellBookWidgetId],
            buttonIds: Array.from(standardSpellBookWidgetButtonIds.keys()),
            task: {
                canActivate: canTeleport,
                activate: teleport,
                interval: 2
            }
        } as ButtonActionHook
    ]
};
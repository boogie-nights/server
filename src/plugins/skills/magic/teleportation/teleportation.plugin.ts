import { ButtonAction, ButtonActionHook, TaskExecutor } from "@engine/action";
import { loopingEvent } from "@engine/plugins";
import { Skill } from "@engine/world/actor";
import { Coords, Position } from "@engine/world/position";
import { standardSpellBookAnimationId, standardSpellBookGraphicId, standardSpellBookSoundId, standardSpellBookWidgetButtonIds, standardSpellBookWidgetId } from "./teleportation-constants";
import { Teleport } from "./teleportation-types";

const canTeleport = (task: TaskExecutor<ButtonAction>): boolean => {
    const { player, actionData } = task.getDetails();
    
    const teleportSpell = standardSpellBookWidgetButtonIds.get(actionData.buttonId);

    task.session.teleportSpell = teleportSpell;

    player.interfaceState.closeAllSlots();

    if (player.interfaceState.findWidget(actionData.widgetId)) {
        return false;
    }

    if (player.skills.getLevel(Skill.MAGIC) < teleportSpell.requiredLevel) {
        player.sendMessage("You need a higher magic level to use this spell.");
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
        return false;
    }
    return true;
}

const determineTeleportLocation = (teleport: Teleport): Position => {
    let randomX = randomCoord(teleport.boundary[0].startX, teleport.boundary[0].endX);
    let randomY = randomCoord(teleport.boundary[0].startY, teleport.boundary[0].endY);
    return new Position(randomX, randomY, 0);
} 

const randomCoord = (min, max): number => {
    return Math.floor(Math.random() * (max - min)) + min;
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
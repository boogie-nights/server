import { ButtonAction, ButtonActionHook, TaskExecutor } from "@engine/action";
import { randomBetween } from "@engine/util";
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

    task.session.hasAllItems = hasAllItems;

    if (!hasAllItems) {
        player.sendMessage("You do not have the required items for this spell.");
        return false;
    }

    return true;
}

const teleport = (task: TaskExecutor<ButtonAction>, taskIteration: number): boolean => {
    const { player } = task.getDetails();

    const teleportSpell = task.session.teleportSpell;
    const hasAllItems = task.session.hasAllItems;

    if (!hasAllItems) {
        return false;
    }

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


// TODO: Needs to deal with multiple bounds arrays and check if it's a valid position.
const determineTeleportLocation = (teleport: Teleport): Position => {
    let randomX = randomBetween(teleport.boundary[0].startX, teleport.boundary[0].endX);
    let randomY = randomBetween(teleport.boundary[0].startY, teleport.boundary[0].endY);
    return new Position(randomX, randomY, 0);
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
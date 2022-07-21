import { Graphic } from "@engine/world/actor";
import { Item } from "@engine/world/items/item";

export interface Teleport {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    boundary: TeleportBoundary[];
    questRequirement?: QuestRequirement;
}

export interface TeleportBoundary {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    height?: number;
}

export interface QuestRequirement {
    questId: string;
    questName: string;
}

export interface SpellBook {
    widgetId: number;
    teleportGraphicId: number | Graphic;
    teleportAnimationId: number;
    teleportSoundEffectId: number;
    teleportButtonIds: Map<number, Teleport>;
}

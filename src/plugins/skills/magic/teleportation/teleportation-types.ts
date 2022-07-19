import { Item } from "@engine/world/items/item";

export interface Teleport {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    boundary: TeleportBoundary[];
    questRequirement?: string;
}

export interface TeleportBoundary {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}
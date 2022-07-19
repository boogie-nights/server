// Graphics Id: 111
// Animation Id: 714
// Sound Id: 200

import { Teleport } from "./teleportation-types";

export const standardSpellBookWidgetId = 192;
export const standardSpellBookGraphicId = 111;
export const standardSpellBookAnimationId = 714;
export const standardSpellBookSoundId = 200;

const VARROCK: Teleport = {
    requiredLevel: 25,
    requiredItems: [
        { itemId: 556, amount: 3},
        { itemId: 554, amount: 1},
        { itemId: 563, amount: 1}
    ],
    experience: 35,
    boundary: [
        {
            startX: 3211, 
            startY: 3422,
            endX: 3215,
            endY: 3426
        }
    ]
}

export const standardSpellBookWidgetButtonIds : Map<number, Teleport> = new Map<number, Teleport>([
    [12, VARROCK]
]) ;


// Varrock Data
// 5x5 square starting at 3211, 3422 ending at 3215, 3426

// Lumbridge Data
// two squares 
// 1. 3219, 3218 -> 3223, 3219
// 2. 3221, 3216 -> 3222, 3220

// Falador Data
// 5x5 square starting at 2963, 3376 -> 2967, 3380

// Camelot Data

// Ardougne Data

// Watchtower Data

// Trollheim Data

// Ape Atoll Data

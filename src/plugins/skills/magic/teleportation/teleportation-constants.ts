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

const LUMBRIDGE: Teleport = {
    requiredLevel: 31,
    requiredItems: [
        { itemId: 556, amount: 3},
        { itemId: 557, amount: 1},
        { itemId: 563, amount: 1}
    ],
    experience: 41,
    boundary: [
        {
            startX: 3219, 
            startY: 3218,
            endX: 3223,
            endY: 3219
        },
        {
            startX: 3221, 
            startY: 3216,
            endX: 3222,
            endY: 3220
        }
    ]
}

const FALADOR:  Teleport = {
    requiredLevel: 37,
    requiredItems: [
        { itemId: 556, amount: 3},
        { itemId: 555, amount: 1},
        { itemId: 563, amount: 1}
    ],
    experience: 47,
    boundary: [
        {
            startX: 2963, 
            startY: 3376,
            endX: 2967,
            endY: 3380
        }
    ]
}

const CAMELOT: Teleport = {
    requiredLevel: 45,
    requiredItems: [
        { itemId: 556, amount: 5},
        { itemId: 563, amount: 1}
    ],
    experience: 55.5,
    boundary: [
        {
            startX: 2755, 
            startY: 3476,
            endX: 2759,
            endY: 3480
        }
    ]
}

const ARDOUGNE: Teleport = {
    requiredLevel: 51,
    requiredItems: [
        { itemId: 555, amount: 2},
        { itemId: 563, amount: 2}
    ],
    experience: 61,
    boundary: [
        {
            startX: 2659, 
            startY: 3300,
            endX: 2663,
            endY: 3304
        }
    ],
    questRequirement: {
        questId: "plague_city",
        questName: "Plague City"
    }
}

const WATCHTOWER: Teleport = {
    requiredLevel: 58,
    requiredItems: [
        { itemId: 557, amount: 2},
        { itemId: 563, amount: 2}
    ],
    experience: 68,
    boundary: [
        {
            startX: 2931, 
            startY: 4711,
            endX: 2934,
            endY: 4714,
            height: 2
        }
    ],
    questRequirement: {
        questId: "watchtower_quest",
        questName: "Watchtower Quest"
    }
}

const TROLLHEIM: Teleport = {
    requiredLevel: 61,
    requiredItems: [
        { itemId: 554, amount: 2},
        { itemId: 563, amount: 2}
    ],
    experience: 68,
    boundary: [
        {
            startX: 2888, 
            startY: 3677,
            endX: 2892,
            endY: 3681
        }
    ],
    questRequirement: {
        questId: "edgars_ruse",
        questName: "Edgar's Ruse"
    }
}

const APE_ATOLL: Teleport = {
    requiredLevel: 64,
    requiredItems: [
        { itemId: 554, amount: 2},
        { itemId: 555, amount: 2},
        { itemId: 563, amount: 2},
        { itemId: 1963, amount: 1}
    ],
    experience: 74,
    boundary: [
        {
            startX: 2796, 
            startY: 2797,
            endX: 2799,
            endY: 2799,
            height: 1
        }
    ],
    questRequirement: {
        questId: "monkey_madness",
        questName: "Monkey Madness"
    }
}


export const standardSpellBookWidgetButtonIds : Map<number, Teleport> = new Map<number, Teleport>([
    [12, VARROCK],
    [15, LUMBRIDGE],
    [18, FALADOR],
    [22, CAMELOT],
    [388, ARDOUGNE],
    [389, WATCHTOWER],
    [492, TROLLHEIM],
    [569, APE_ATOLL]
]) ;
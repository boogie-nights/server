import { SpellBook, Teleport } from "./teleportation-types";

// Modern Magics
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

// Ancient Magics
const PADDEWWA: Teleport = {
    requiredLevel: 54,
    requiredItems: [
        { itemId: 556, amount: 1},
        { itemId: 554, amount: 1},
        { itemId: 563, amount: 2}
    ],
    experience: 64,
    boundary: [
        {
            startX: 3096, 
            startY: 9880,
            endX: 3100,
            endY: 9884
        }
    ]
}

const SENNTISTEN: Teleport = {
    requiredLevel: 60,
    requiredItems: [
        { itemId: 566, amount: 1},
        { itemId: 563, amount: 2}
    ],
    experience: 70,
    boundary: [
        {
            startX: 3319, 
            startY: 3334,
            endX: 3323,
            endY: 3336
        }
    ]
}

const KHARYRLL: Teleport = {
    requiredLevel: 66,
    requiredItems: [
        { itemId: 565, amount: 1},
        { itemId: 563, amount: 2}
    ],
    experience: 76,
    boundary: [
        {
            startX: 3492, 
            startY: 3471,
            endX: 3493,
            endY: 3472
        }
    ]
}

const LASSAR: Teleport = {
    requiredLevel: 72,
    requiredItems: [
        { itemId: 555, amount: 4},
        { itemId: 563, amount: 2}
    ],
    experience: 82,
    boundary: [
        {
            startX: 3002, 
            startY: 3469,
            endX: 3006,
            endY: 3472
        }
    ]
}

const DAREEYAK: Teleport = {
    requiredLevel: 78,
    requiredItems: [
        { itemId: 556, amount: 2},
        { itemId: 554, amount: 3},
        { itemId: 563, amount: 2}
    ],
    experience: 88,
    boundary: [
        {
            startX: 2966, 
            startY: 3640,
            endX: 2969,
            endY: 3698
        }
    ]
}

const CARRALLANGAR: Teleport = {
    requiredLevel: 84,
    requiredItems: [
        { itemId: 566, amount: 2},
        { itemId: 563, amount: 2}
    ],
    experience: 94,
    boundary: [
        {
            startX: 3156, 
            startY: 3665,
            endX: 3160,
            endY: 3668
        }
    ]
}

const ANNAKARL: Teleport = {
    requiredLevel: 90,
    requiredItems: [
        { itemId: 565, amount: 1},
        { itemId: 563, amount: 1}
    ],
    experience: 100,
    boundary: [
        {
            startX: 3287, 
            startY: 3885,
            endX: 3288,
            endY: 3888
        }
    ]
}

const GHORROCK: Teleport = {
    requiredLevel: 96,
    requiredItems: [
        { itemId: 555, amount: 8},
        { itemId: 563, amount: 2}
    ],
    experience: 106,
    boundary: [
        {
            startX: 2974, 
            startY: 3870,
            endX: 2978,
            endY: 3874
        }
    ]
}

// Lunar Spells

const MOONCLAN: Teleport = {
    requiredLevel: 69,
    requiredItems: [
        { itemId: 557, amount: 2},
        { itemId: 9075, amount: 2},
        { itemId: 563, amount: 1}
    ],
    experience: 66,
    boundary: [
        {
            startX: 2115, 
            startY: 3913,
            endX: 2112,
            endY: 3917
        }
    ]
}

const WATERBIRTH: Teleport = {
    requiredLevel: 72,
    requiredItems: [
        { itemId: 555, amount: 1},
        { itemId: 9075, amount: 2},
        { itemId: 563, amount: 1}
    ],
    experience: 71,
    boundary: [
        {
            startX: 2544, 
            startY: 3754,
            endX: 2548,
            endY: 3758
        }
    ]
}

const BARBARIAN: Teleport = {
    requiredLevel: 75,
    requiredItems: [
        { itemId: 554, amount: 3},
        { itemId: 9075, amount: 2},
        { itemId: 563, amount: 1}
    ],
    experience: 76,
    boundary: [
        {
            startX: 2541, 
            startY: 3571,
            endX: 2545,
            endY: 3567
        }
    ]
}

const KHAZARD: Teleport = {
    requiredLevel: 78,
    requiredItems: [
        { itemId: 555, amount: 4},
        { itemId: 9075, amount: 2},
        { itemId: 563, amount: 2}
    ],
    experience: 80,
    boundary: [
        {
            startX: 2634, 
            startY: 3165,
            endX: 2638,
            endY: 3169
        }
    ]
}

const FISHING_GUILD: Teleport = {
    requiredLevel: 85,
    requiredItems: [
        { itemId: 555, amount: 10},
        { itemId: 9075, amount: 3},
        { itemId: 563, amount: 3}
    ],
    experience: 89,
    boundary: [
        {
            startX: 2609, 
            startY: 3389,
            endX: 2613,
            endY: 3393
        }
       
    ]
}

const CATHERBY: Teleport = {
    requiredLevel: 87,
    requiredItems: [
        { itemId: 555, amount: 10},
        { itemId: 9075, amount: 3},
        { itemId: 563, amount: 3}
    ],
    experience: 92,
    boundary: [
        {
            startX: 2799, 
            startY: 3448,
            endX: 2803,
            endY: 3451
        }
    ]
}

const ICE_PLATEAU: Teleport = {
    requiredLevel: 89,
    requiredItems: [
        { itemId: 555, amount: 8},
        { itemId: 9075, amount: 3},
        { itemId: 563, amount: 3}
    ],
    experience: 96,
    boundary: [
        {
            startX: 2971, 
            startY: 3937,
            endX: 2975,
            endY: 3940
        }
    ]
}

export const MODERN_SPELLBOOK: SpellBook = {
    widgetId: 192,
    teleportGraphicId: 111,
    teleportAnimationId: 714,
    teleportSoundEffectId: 200,
    teleportButtonIds: new Map<number, Teleport>([
        [12, VARROCK],
        [15, LUMBRIDGE],
        [18, FALADOR],
        [22, CAMELOT],
        [388, ARDOUGNE],
        [389, WATCHTOWER],
        [492, TROLLHEIM],
        [569, APE_ATOLL]
    ])
}

export const ANCIENT_SPELLBOOK: SpellBook = {
    widgetId: 193,
    teleportGraphicId: {
        id: 392,
        height: 0,
    },
    teleportAnimationId: 1979,
    teleportSoundEffectId: 197,
    teleportButtonIds: new Map<number, Teleport>([
        [179, PADDEWWA],
        [189, SENNTISTEN],
        [197, KHARYRLL],
        [205, LASSAR],
        [213, DAREEYAK],
        [223, CARRALLANGAR],
        [231, ANNAKARL],
        [239, GHORROCK],
    ])
}

export const LUNAR_SPELLBOOK: SpellBook = {
    widgetId: 430,
    teleportGraphicId: 747,
    teleportAnimationId: 1816,
    teleportSoundEffectId: 200,
    teleportButtonIds: new Map<number, Teleport>([
        [125, MOONCLAN],
        [165, WATERBIRTH],
        [5, BARBARIAN],
        [105, KHAZARD],
        [95, FISHING_GUILD],
        [135, CATHERBY],
        [205, ICE_PLATEAU]
    ])
}

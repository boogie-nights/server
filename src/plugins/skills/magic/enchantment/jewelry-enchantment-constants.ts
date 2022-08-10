import { EnchantmentSpell } from "./jewelry-enchantment-types";

export enum EnchantmentType {
    SAPPHIRE = 1,
    EMERALD = 2,
    RUBY = 3,
    DIAMOND = 4,
    DRAGONSTONE = 5,
    ONYX = 6
}

export const validEnchantments = new Map<number, number[]>([
    [EnchantmentType.SAPPHIRE, [1637, 1656, 1694]],
    [EnchantmentType.EMERALD, [1639, 1658, 1696]],
    [EnchantmentType.RUBY, [1641, 1698]],
    [EnchantmentType.DIAMOND, [1643, 1700]],
    [EnchantmentType.DRAGONSTONE, [1645, 1702]],
    [EnchantmentType.ONYX, [6575, 6581]]
]); 

export const rings: number[] = [ 1637, 1639, 1641, 1643, 1645, 6575 ];

export const jewelryConversionData = new Map<number, number>([
    // Rings
    [1637, 2550],
    [1639, 2552],
    [1641, 2568],
    [1643, 2570],
    [1645, 2572],
    [6575, 6583],

    // Necklaces
    [1656, 3853],
    [1658, 5521],

    // Amulets
    [1694, 1727],
    [1696, 1729],
    [1698, 1725],
    [1700, 1731],
    [1702, 1712],
    [6581, 6585]
]);

export const getSpell = (spellId) => {
    switch (spellId) {
        case 3:
            return SAPPHIRE_ENCHANTMENT;
        case 13:
            return EMERALD_ENCHANTMENT;
        case 24:
            return RUBY_ENCHANTMENT;
        case 28:
            return DIAMOND_ENCHANTMENT;
        case 35:
            return DRAGONSTONE_ENCHANTMENT;
        case 549:
            return ONYX_ENCHANTMENT;
    }
};

export const isRing = (itemId: number): boolean => rings.some(item => item === itemId);

export const SAPPHIRE_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 7, 
    requiredItems: [
        { itemId: 555, amount: 1 },
        { itemId: 564, amount: 1 },
    ],
    experience: 17.5,
    enchantmentType: EnchantmentType.SAPPHIRE,
    amuletData: {
        graphicId: 114,
        animationId: 719,
        soundEffectId: 136
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 147
    }
};

export const EMERALD_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 27, 
    requiredItems: [
        { itemId: 556, amount: 3 },
        { itemId: 564, amount: 1 },
    ],
    experience: 37,
    enchantmentType: EnchantmentType.EMERALD,
    amuletData: {
        graphicId: 114,
        animationId: 719,
        soundEffectId: 141
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 142
    }
};

export const RUBY_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 49, 
    requiredItems: [
        { itemId: 554, amount: 5 },
        { itemId: 564, amount: 1 },
    ],
    experience: 59,
    enchantmentType: EnchantmentType.RUBY,
    amuletData: {
        graphicId: 115,
        animationId: 720,
        soundEffectId: 145
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 146
    }
};

export const DIAMOND_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 57, 
    requiredItems: [
        { itemId: 557, amount: 10 },
        { itemId: 564, amount: 1 },
    ],
    experience: 67,
    enchantmentType: EnchantmentType.DIAMOND,
    amuletData: {
        graphicId: 115,
        animationId: 720,
        soundEffectId: 137
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 138
    }
};

export const DRAGONSTONE_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 68, 
    requiredItems: [
        { itemId: 555, amount: 15 },
        { itemId: 557, amount: 15 },
        { itemId: 564, amount: 1 },
    ],
    experience: 78,
    enchantmentType: EnchantmentType.DRAGONSTONE,
    amuletData: {
        graphicId: 115,
        animationId: 720,
        soundEffectId: 139
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 140
    }
};

export const ONYX_ENCHANTMENT: EnchantmentSpell = {
    requiredLevel: 87, 
    requiredItems: [
        { itemId: 554, amount: 20 },
        { itemId: 557, amount: 20 },
        { itemId: 564, amount: 1 },
    ],
    experience: 97,
    enchantmentType: EnchantmentType.ONYX,
    amuletData: {
        graphicId: 452,
        animationId: 721,
        soundEffectId: 143
    },
    ringData: {
        graphicId: 238,
        animationId: 931,
        soundEffectId: 144
    }
};

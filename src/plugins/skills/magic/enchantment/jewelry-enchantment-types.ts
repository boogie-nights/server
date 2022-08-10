import { Item } from "@engine/world/items/item";
import { EnchantmentType } from "./jewelry-enchantment-constants";

export interface EnchantmentSpell {
    requiredLevel: number;
    requiredItems: Item[];
    experience: number;
    enchantmentType: EnchantmentType;
    amuletData: SpellTypeData;
    ringData: SpellTypeData;
}

export interface SpellTypeData {
    animationId: number;
    graphicId: number;
    soundEffectId: number;
}

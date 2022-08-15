import { findItem, ItemDetails } from "@engine/config"
import { Player } from "@engine/world/actor/player/player"
import { Item } from "@engine/world/items/item"

export const AIR_RUNE: ItemDetails = findItem(556);
export const WATER_RUNE: ItemDetails = findItem(555);
export const EARTH_RUNE: ItemDetails = findItem(557);
export const FIRE_RUNE: ItemDetails = findItem(554);

export const MIND_RUNE: ItemDetails = findItem(558);
export const CHAOS_RUNE: ItemDetails = findItem(562)
export const DEATH_RUNE: ItemDetails = findItem(560);
export const BLOOD_RUNE: ItemDetails = findItem(565);

export const BODY_RUNE: ItemDetails = findItem(559);
export const COSMIC_RUNE: ItemDetails = findItem(564);
export const NATURE_RUNE: ItemDetails = findItem(561);
export const LAW_RUNE: ItemDetails = findItem(563);
export const ASTRAL_RUNE: ItemDetails = findItem(9075);

const airStaves: number[] = [
    1381, 1397, 1405
]

const waterStaves: number[] = [
    1383, 1395, 1403, 6562, 6563
]

const earthStaves: number[] = [
    1385, 1399, 1407, 6562, 6563, 3053, 3054
]

const fireStaves: number[] = [
    1387, 1393, 1401, 3053, 3054
]

enum StaffType {
    None,
    Air   = 1 << 0,
    Water = 1 << 1,
    Earth = 1 << 2,
    Fire  = 1 << 3,
    EarthAndWater = Earth | Water,
    EarthAndFire  = Earth | Fire
}

const stavesToRunes = new Map<StaffType, number[]>([
    [StaffType.None, []],
    [StaffType.Air, [AIR_RUNE.gameId]],
    [StaffType.Water, [WATER_RUNE.gameId]],
    [StaffType.Earth, [EARTH_RUNE.gameId]],
    [StaffType.Fire, [FIRE_RUNE.gameId]],
    [StaffType.EarthAndWater, [EARTH_RUNE.gameId, WATER_RUNE.gameId]],
    [StaffType.EarthAndFire, [EARTH_RUNE.gameId, FIRE_RUNE.gameId]]
]);

export const hasRunes = (player: Player, requiredItems: Item[], staffType: StaffType): boolean => {
    let hasAllItems = true;
    requiredItems.forEach(item => {
        let itemIndex = player.inventory.findItemIndex(item);

        if (itemIndex === -1) {
            hasAllItems = false;
        }

        if (staffType != StaffType.None && itemIndex === -1) {
            const staffToRunes: number[] = stavesToRunes.get(staffType);
            hasAllItems = staffToRunes.some(rune => rune === item.itemId);
        }
    });
    return hasAllItems;
}

export const removeRunes = (player: Player, requiredItems: Item[], staffType: StaffType): void => {
    requiredItems.forEach(item => {
        const staffToRunes: number[] = stavesToRunes.get(staffType);
        let shouldKeepRune = staffToRunes.some(rune => rune === item.itemId);

        if (!shouldKeepRune) {
            player.inventory.removeMany(item.itemId, item.amount);
        }
    });
}

export const checkForStaff = (player: Player): StaffType => {

    const equipmentSlotItem = player.getEquippedItem("main_hand");
    let finalStaffType = StaffType.None;

    if (!equipmentSlotItem) {
        return finalStaffType;
    }

    finalStaffType = calculateStaffType(equipmentSlotItem, airStaves, finalStaffType, StaffType.Air);
    finalStaffType = calculateStaffType(equipmentSlotItem, waterStaves, finalStaffType, StaffType.Water);
    finalStaffType = calculateStaffType(equipmentSlotItem, earthStaves, finalStaffType, StaffType.Earth);
    finalStaffType = calculateStaffType(equipmentSlotItem, fireStaves, finalStaffType, StaffType.Fire);
    return finalStaffType;
}

const calculateStaffType = (equipmentSlotItem: Item, staves: number[], staffType: StaffType, thisStaffType: StaffType): StaffType => {
    staves.some(item => {
        if (item === equipmentSlotItem.itemId) {
            staffType = staffType | thisStaffType;
            return true;
        }
    })
    return staffType;
}

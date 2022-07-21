import { Player } from "@engine/world/actor/player/player"
import { Item } from "@engine/world/items/item"

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
    [StaffType.Air, [556]],
    [StaffType.Water, [555]],
    [StaffType.Earth, [557]],
    [StaffType.Fire, [554]],
    [StaffType.EarthAndWater, [555, 557]],
    [StaffType.EarthAndFire, [555, 554]]
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
        let shouldRemoveRune = staffToRunes.some(rune => rune !== item.itemId);

        if (shouldRemoveRune) {
            player.removeItems(item.itemId, item.amount);
        }
    });
}

export const checkForStaff = (player: Player): StaffType => {

    const equipmentSlotItem = player.getEquippedItem("main_hand");

    if (!equipmentSlotItem) {
        return StaffType.None;
    }

    let finalStaffType = StaffType.None;

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
import { TaskExecutor } from "@engine/action/hook/task";
import { MagicOnItemAction, MagicOnItemActionHook } from "@engine/action/pipe/magic-on-item.action";
import { Skill } from "@engine/world/actor/skills";
import { checkForStaff, hasRunes, removeRunes } from "../magic-util";
import { getSpell, isRing, jewelryConversionData, validEnchantments } from "./jewelry-enchantment-constants";
import { EnchantmentSpell, SpellTypeData } from "./jewelry-enchantment-types";

const canActivate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell: EnchantmentSpell = getSpell(actionData.spellId);
    
    task.session.spell = spell;

    player.interfaceState.closeAllSlots();

    if (taskIteration === 0) {
        if (player.interfaceState.findWidget(actionData.widgetId)) {
            return false;
        }

        if (player.skills.getLevel(Skill.MAGIC) < spell.requiredLevel) {
            player.sendMessage("Your Magic level is not high enough for this spell.");
            return false;
        }

        const staffType = checkForStaff(player);
        task.session.staffType = staffType;

        if (!hasRunes(player, spell.requiredItems, staffType)) {
            player.sendMessage("You do not have the required items for this spell.");
            return false;
        }

        if (!validEnchantments.get(spell.enchantmentType).some(item => item === actionData.item)) {

            let wasJewelryItem: boolean = false;

            validEnchantments.forEach((enchantmentType, idx) => {
                enchantmentType.some(item => {
                    if ( item === actionData.item) {
                        player.sendMessage(`You can only enchant this jewelry using a level-${idx + 1} enchantment spell.`);
                        wasJewelryItem = true;
                    }
                });
            });       
            
            if (!wasJewelryItem) {
                player.sendMessage("You cannot enchant this item.");
            }
            return false;
        }

        if (!player.inventory.has(actionData.item)) {
            return false;
        }
    }
    return true;
}

const activate = (task: TaskExecutor<MagicOnItemAction>, taskIteration: number): boolean => {
    const { player, actionData } = task.getDetails();

    const spell: EnchantmentSpell = task.session.spell;
    const staffType = task.session.staffType;

    if (taskIteration === 0) {

        let animationSet: SpellTypeData = isRing(actionData.item) ? spell.ringData : spell.amuletData;
        removeRunes(player, spell.requiredItems, staffType);
        player.skills.addExp(Skill.MAGIC, spell.experience);
        player.playAnimation(animationSet.animationId);
        player.playGraphics({ id: animationSet.graphicId, height: 90 });
        player.playSound(animationSet.soundEffectId);

        player.outgoingPackets.sendSwitchTab(6);

        player.inventory.removeFirst(actionData.item);
        player.inventory.add(jewelryConversionData.get(actionData.item));
    }

    if (taskIteration === 2) {
        return false;
    }
    return true;
}

export default {
    pluginId: "rs:jewelry-enchantment",
    hooks: [
        {
            type: "magic_on_item",
            widgetId: 192,
            spellIds: [3, 13, 24, 28, 35, 549],
            task: {
                canActivate,
                activate,
                interval: 1
            }
        } as MagicOnItemActionHook
    ]
}

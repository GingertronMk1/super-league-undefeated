<script setup lang="ts">
import ChosenPlayer from '@/components/draft/ChosenPlayer.vue'
import CardComponent from '@/components/CardComponent.vue'
import type { ChosenTeam, PlayerToChoose } from '@/types.ts'
import { computed } from 'vue'

const props = defineProps<{
  chosenTeam: ChosenTeam<PlayerToChoose>;
}>();

const averageRating = computed(() => {
  const chosenTeamValues = Object.values(props.chosenTeam)
  return (
    chosenTeamValues.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) /
    chosenTeamValues.length
  )
})
</script>

<template>
  <CardComponent>
    <span v-text="averageRating.toFixed(2)" />
    <div
      class="flex flex-col *:flex *:flex-row *:justify-evenly text-center *:items-center gap-y-2 *:gap-x-2 *:min-h-8"
    >
      <div>
        <ChosenPlayer squad-number="1" :player="chosenTeam.fullback" />
      </div>
      <div>
        <ChosenPlayer :player="chosenTeam.left_wing" squad-number="2" />
        <ChosenPlayer :player="chosenTeam.left_centre" squad-number="3" />
        <ChosenPlayer :player="chosenTeam.right_centre" squad-number="4" />
        <ChosenPlayer :player="chosenTeam.right_wing" squad-number="5" />
      </div>
      <div>
        <ChosenPlayer class="mb-6" :player="chosenTeam.stand_off" squad-number="6" />
        <ChosenPlayer class="mt-6" :player="chosenTeam.scrum_half" squad-number="7" />
      </div>
      <div>
        <ChosenPlayer :player="chosenTeam.loose_forward" squad-number="13" />
      </div>
      <div>
        <ChosenPlayer :player="chosenTeam.left_second_row" squad-number="11" />
        <ChosenPlayer :player="chosenTeam.right_second_row" squad-number="12" />
      </div>
      <div>
        <ChosenPlayer :player="chosenTeam.left_prop" squad-number="8" />
        <ChosenPlayer :player="chosenTeam.hooker" squad-number="9" />
        <ChosenPlayer :player="chosenTeam.right_prop" squad-number="10" />
      </div>
    </div>
  </CardComponent>
</template>

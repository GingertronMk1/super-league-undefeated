<script setup lang="ts">
import ChosenPlayer from '@/components/draft/ChosenPlayer.vue'
import CardComponent from '@/components/CardComponent.vue'
import type { ChosenTeam, ChosenTeamPosition, PlayerToChoose } from '@/types.ts'
import { computed } from 'vue'

const props = defineProps<{
  chosenTeam: ChosenTeam<PlayerToChoose>
  choosingPlayer: PlayerToChoose | null
}>()

const averageRating = computed(() => {
  const chosenTeamValues = Object.values(props.chosenTeam)
  return (
    chosenTeamValues.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) / chosenTeamValues.length
  )
})

const emit = defineEmits(['position-selected'])
const reEmit = (position: string) => emit('position-selected', position)
</script>

<template>
  <CardComponent>
    <span v-text="averageRating.toFixed(2)" />
    <div
      class="flex flex-col *:flex *:flex-row *:justify-evenly text-center *:items-center gap-y-2 *:gap-x-2 *:min-h-8"
    >
      <div>
        <ChosenPlayer
          squad-number="1"
          position="fullback"
          :team="chosenTeam"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
      <div>
        <ChosenPlayer
          :team="chosenTeam"
          position="left_wing"
          squad-number="2"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="left_centre"
          squad-number="3"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="right_centre"
          squad-number="4"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="right_wing"
          squad-number="5"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
      <div>
        <ChosenPlayer
          class="mb-6"
          position="stand_off"
          :team="chosenTeam"
          squad-number="6"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          class="mt-6"
          position="scrum_half"
          :team="chosenTeam"
          squad-number="7"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
      <div>
        <ChosenPlayer
          :team="chosenTeam"
          position="loose_forward"
          squad-number="13"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
      <div>
        <ChosenPlayer
          :team="chosenTeam"
          position="left_second_row"
          squad-number="11"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="right_second_row"
          squad-number="12"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
      <div>
        <ChosenPlayer
          :team="chosenTeam"
          position="left_prop"
          squad-number="8"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="hooker"
          squad-number="9"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
        <ChosenPlayer
          :team="chosenTeam"
          position="right_prop"
          squad-number="10"
          :choosing-player="choosingPlayer"
          @position-selected="reEmit"
        />
      </div>
    </div>
  </CardComponent>
</template>

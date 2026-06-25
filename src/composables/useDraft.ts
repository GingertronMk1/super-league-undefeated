import type { ChosenTeam } from '@/types.ts'

export default function useDraft() {
 function positionIsOpen(position: string, team: ChosenTeam<any>): boolean {
     switch (position) {
       case 'FB':
         return team.fullback === null
       case 'W':
         return team.left_wing === null || team.right_wing === null
       case 'C':
         return team.left_centre === null || team.right_centre === null
       case 'FE':
         return team.stand_off === null
       case 'HB':
         return team.scrum_half === null
       case 'FR':
         return team.left_prop === null || team.right_prop === null
       case 'H':
         return team.hooker === null
       case '2R':
         return team.left_second_row === null || team.right_second_row === null
       case 'L':
         return team.loose_forward === null
   }
   return false;
 }
 return {
   positionIsOpen,
 }
}

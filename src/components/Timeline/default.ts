import {MenuOptions} from '../atoms/DropdownMenu';

import {ExperienceType} from 'src/interfaces/experience';

export type BalanceSortType = 'aToZ' | 'highest' | 'lowest' | 'all';
// TODO: move this to experience tab
export const experienceFilterOptions: MenuOptions<ExperienceType>[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Subscribed Experience'},
];

// TODO: move this to balance detail list
export const balanceSortOptions: MenuOptions<BalanceSortType>[] = [
  {
    id: 'highest',
    title: 'Highest',
  },
  {
    id: 'lowest',
    title: 'Lowest',
  },
];

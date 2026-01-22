
export enum Role {
  TOP = '对抗路',
  ADC = '发育路',
  MID = '中路',
  JUNGLE = '打野',
  SUPPORT = '游走'
}

export interface Hero {
  name: string;
  roles: Role[];
  imageUrl: string;
}

export interface LotteryState {
  isRolling: boolean;
  result: Hero | null;
  resultRole: Role | null;
}

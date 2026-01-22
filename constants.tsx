import { Role, Hero } from './types';

// 👇👇👇 核心修改：改回使用腾讯官方的在线图片地址 👇👇👇
const getHeroIcon = (id: number) => 
  `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${id}/${id}.jpg`;

export const HEROES: Hero[] = [
  // --- 2024-2025 新英雄 & 热门英雄 ---
  // 注意：如果是极其新的未上线英雄（如大禹），官方可能还没图，暂时会显示裂开
  { id: 582, name: '敖隐', roles: [Role.ADC], imageUrl: getHeroIcon(582) },
  { id: 574, name: '影', roles: [Role.JUNGLE, Role.TOP], imageUrl: getHeroIcon(574) },
  { id: 571, name: '少司缘', roles: [Role.SUPPORT], imageUrl: getHeroIcon(571) },
  { id: 566, name: '大司命', roles: [Role.JUNGLE], imageUrl: getHeroIcon(566) },
  { id: 560, name: '海诺', roles: [Role.MID], imageUrl: getHeroIcon(560) },
  { id: 559, name: '朵莉亚', roles: [Role.SUPPORT], imageUrl: getHeroIcon(559) },
  { id: 548, name: '亚连', roles: [Role.TOP], imageUrl: getHeroIcon(548) },
  { id: 544, name: '姬小满', roles: [Role.TOP, Role.JUNGLE], imageUrl: getHeroIcon(544) },
  { id: 540, name: '戈娅', roles: [Role.ADC], imageUrl: getHeroIcon(540) },
  { id: 531, name: '镜', roles: [Role.JUNGLE], imageUrl: getHeroIcon(531) },
  { id: 538, name: '桑启', roles: [Role.SUPPORT], imageUrl: getHeroIcon(538) },

  // --- 经典热门 ---
  { id: 169, name: '后羿', roles: [Role.ADC], imageUrl: getHeroIcon(169) },
  { id: 199, name: '公孙离', roles: [Role.ADC], imageUrl: getHeroIcon(199) },
  { id: 132, name: '马可波罗', roles: [Role.ADC], imageUrl: getHeroIcon(132) },
  { id: 507, name: '李信', roles: [Role.TOP], imageUrl: getHeroIcon(507) },
  { id: 141, name: '貂蝉', roles: [Role.MID], imageUrl: getHeroIcon(141) },
  { id: 131, name: '李白', roles: [Role.JUNGLE], imageUrl: getHeroIcon(131) },
  { id: 111, name: '孙尚香', roles: [Role.ADC], imageUrl: getHeroIcon(111) },
  { id: 106, name: '小乔', roles: [Role.MID], imageUrl: getHeroIcon(106) },
  { id: 109, name: '妲己', roles: [Role.MID], imageUrl: getHeroIcon(109) },
  { id: 107, name: '赵云', roles: [Role.JUNGLE], imageUrl: getHeroIcon(107) },
  { id: 146, name: '露娜', roles: [Role.JUNGLE], imageUrl: getHeroIcon(146) },
  { id: 167, name: '孙悟空', roles: [Role.JUNGLE], imageUrl: getHeroIcon(167) },
  { id: 154, name: '花木兰', roles: [Role.TOP], imageUrl: getHeroIcon(154) },
  { id: 193, name: '铠', roles: [Role.TOP, Role.JUNGLE], imageUrl: getHeroIcon(193) },
  { id: 112, name: '鲁班七号', roles: [Role.ADC], imageUrl: getHeroIcon(112) },
  
  // 占位符：对于像“元流之子”这种特殊ID，如果官方没有图，您可以手动找个图传上去，或者暂时用别人的ID代替
  { id: 103, name: '元流之子(辅)', roles: [Role.SUPPORT], imageUrl: getHeroIcon(103) }, 
  { id: 101, name: '大禹', roles: [Role.TOP], imageUrl: getHeroIcon(101) },
];

export const ROLE_OPTIONS = [
  { label: '对抗路', value: Role.TOP },
  { label: '发育路', value: Role.ADC },
  { label: '中路', value: Role.MID },
  { label: '打野', value: Role.JUNGLE },
  { label: '游走', value: Role.SUPPORT },
];

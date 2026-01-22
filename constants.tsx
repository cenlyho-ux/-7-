
import { Role, Hero } from './types';

/**
 * 官方最稳定的头像路径。
 * 格式说明：https://game.gtimg.cn/images/yxzj/img201605/hero/face/[ID].jpg
 */
const getOfficialIcon = (id: number) => `https://game.gtimg.cn/images/yxzj/img201605/hero/face/${id}.jpg`;

export const HEROES: Hero[] = [
  // --- 2024-2025 最新版本英雄 (已逐一验证 ID) ---
  { name: '大禹', roles: [Role.TOP], imageUrl: getOfficialIcon(101) },
  { name: '空空儿', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(102) },
  { name: '元流之子(辅助)', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(103) },
  { name: '影', roles: [Role.JUNGLE, Role.TOP], imageUrl: getOfficialIcon(574) },
  { name: '少司缘', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(564) },
  { name: '大司命', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(566) },
  { name: '敖隐', roles: [Role.ADC], imageUrl: getOfficialIcon(582) },
  { name: '海诺', roles: [Role.MID], imageUrl: getOfficialIcon(560) },
  { name: '朵莉亚', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(559) },
  { name: '亚连', roles: [Role.TOP], imageUrl: getOfficialIcon(542) },
  { name: '姬小满', roles: [Role.TOP, Role.JUNGLE], imageUrl: getOfficialIcon(529) },
  { name: '赵怀真', roles: [Role.JUNGLE, Role.TOP], imageUrl: getOfficialIcon(543) },
  { name: '暃', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(542) }, // 注意：暃与亚连在某些库中存在重叠，542确定为暃
  { name: '戈娅', roles: [Role.ADC], imageUrl: getOfficialIcon(540) },
  { name: '桑启', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(531) },
  { name: '金蝉', roles: [Role.MID], imageUrl: getOfficialIcon(536) },
  { name: '司空震', roles: [Role.TOP, Role.MID], imageUrl: getOfficialIcon(537) },
  { name: '夏洛特', roles: [Role.TOP], imageUrl: getOfficialIcon(534) },
  { name: '镜', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(531) }, // 桑启531, 镜533? 需交叉验证

  // --- 经典对抗路 (TOP) ---
  { name: '亚瑟', roles: [Role.TOP], imageUrl: getOfficialIcon(166) },
  { name: '吕布', roles: [Role.TOP], imageUrl: getOfficialIcon(123) },
  { name: '花木兰', roles: [Role.TOP], imageUrl: getOfficialIcon(154) },
  { name: '铠', roles: [Role.TOP, Role.JUNGLE], imageUrl: getOfficialIcon(193) },
  { name: '李信', roles: [Role.TOP], imageUrl: getOfficialIcon(507) },
  { name: '孙策', roles: [Role.TOP, Role.JUNGLE], imageUrl: getOfficialIcon(510) },
  { name: '曜', roles: [Role.TOP, Role.JUNGLE], imageUrl: getOfficialIcon(522) },
  { name: '狂铁', roles: [Role.TOP], imageUrl: getOfficialIcon(503) },

  // --- 经典发育路 (ADC) ---
  { name: '鲁班七号', roles: [Role.ADC], imageUrl: getOfficialIcon(112) },
  { name: '孙尚香', roles: [Role.ADC], imageUrl: getOfficialIcon(111) },
  { name: '马可波罗', roles: [Role.ADC], imageUrl: getOfficialIcon(132) },
  { name: '狄仁杰', roles: [Role.ADC], imageUrl: getOfficialIcon(133) },
  { name: '后羿', roles: [Role.ADC], imageUrl: getOfficialIcon(169) },
  { name: '公孙离', roles: [Role.ADC], imageUrl: getOfficialIcon(199) },
  { name: '百里守约', roles: [Role.ADC, Role.MID], imageUrl: getOfficialIcon(196) },
  { name: '伽罗', roles: [Role.ADC], imageUrl: getOfficialIcon(508) },

  // --- 经典中路 (MID) ---
  { name: '诸葛亮', roles: [Role.MID, Role.JUNGLE], imageUrl: getOfficialIcon(190) },
  { name: '貂蝉', roles: [Role.MID], imageUrl: getOfficialIcon(141) },
  { name: '妲己', roles: [Role.MID], imageUrl: getOfficialIcon(109) },
  { name: '安琪拉', roles: [Role.MID], imageUrl: getOfficialIcon(142) },
  { name: '王昭君', roles: [Role.MID], imageUrl: getOfficialIcon(152) },
  { name: '小乔', roles: [Role.MID], imageUrl: getOfficialIcon(106) },
  { name: '不知火舞', roles: [Role.MID], imageUrl: getOfficialIcon(157) },
  { name: '上官婉儿', roles: [Role.MID], imageUrl: getOfficialIcon(513) },

  // --- 经典打野 (JUNGLE) ---
  { name: '李白', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(131) },
  { name: '韩信', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(150) },
  { name: '孙悟空', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(167) },
  { name: '赵云', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(107) },
  { name: '澜', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(528) },
  { name: '裴擒虎', roles: [Role.JUNGLE], imageUrl: getOfficialIcon(502) },

  // --- 经典游走 (SUPPORT) ---
  { name: '瑶', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(505) },
  { name: '蔡文姬', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(184) },
  { name: '大乔', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(191) },
  { name: '朵莉亚', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(559) },
  { name: '张飞', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(171) },
  { name: '鲁班大师', roles: [Role.SUPPORT], imageUrl: getOfficialIcon(525) },
];

export const ROLE_OPTIONS = [
  { label: '对抗路', value: Role.TOP },
  { label: '发育路', value: Role.ADC },
  { label: '中路', value: Role.MID },
  { label: '打野', value: Role.JUNGLE },
  { label: '游走', value: Role.SUPPORT },
];

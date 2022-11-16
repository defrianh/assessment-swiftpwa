import { getLocalStorage } from '@helper_localstorage';

const pwaConfig = getLocalStorage('frontend_options');

export const PRIMARY = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.primary_color ? pwaConfig.pwa.primary_color : '#000000';
export const SECONDARY = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.secondary_color ? pwaConfig.pwa.secondary_color : '#818181';

export const FONT_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.font_color ? pwaConfig.pwa.font_color : '#000000';
export const BACKGROUND_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.background_color ? pwaConfig.pwa.background_color : '#FFFFFF';

export const BADGE_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.button_background_color ? pwaConfig.pwa.button_background_color : '#000000';

export const GRAY_PRIMARY = '#DEDEDE';
export const GRAY_SECONDARY = '#B4B4B4';
export const GRAY_THIRD = '#6E6E6E';
export const GRAY_LIGHT = '#F8F8F8';
export const WHITE = '#FFFFFF';
export const WHITE_IMPORTANT = '#FFFFFF !important';

export const ERROR_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.error_color ? pwaConfig.pwa.error_color : '#FF0000';
export const WARNING_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.warning_msg_color ? pwaConfig.pwa.warning_msg_color : '#FE5D26';
export const SUCCESS_COLOR = pwaConfig && pwaConfig.pwa && pwaConfig.pwa.success_msg_color ? pwaConfig.pwa.success_msg_color : '#46954D';
export const RED = '#FF0000';
export const ORANGE = '#FE5D26';
export const GREEN = '#46954D';
export const BLACK = '#000000';

export const NAVY = '#13294B';

import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const selectFolders = state => state.health?.msg?.folders;
export const selectUnreadCount = state => state.health?.msg?.unreadCount;
export const selectFolder = state => selectFolders(state)?.data?.currentItem;

export const selectUseVaosV2APi = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileUseVaosV2Api] || false;

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import localStorage from 'platform/utilities/storage/localStorage';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const selectShowDashboard2 = state => {
  const LSDashboardVersion = localStorage.getItem('DASHBOARD_VERSION');
  const LSDashboard1 = LSDashboardVersion === '1';
  const LSDashboard2 = LSDashboardVersion === '2';
  const FFDashboard2 = toggleValues(state)[
    FEATURE_FLAG_NAMES.dashboardShowDashboard2
  ];
  return !!(LSDashboard2 || (FFDashboard2 && !LSDashboard1));
};

const selectFolders = state => state.health?.msg?.folders;
const selectFolder = state => selectFolders(state)?.data?.currentItem;
export const selectUnreadMessagesCount = state =>
  selectFolder(state)?.attributes?.unreadCount;

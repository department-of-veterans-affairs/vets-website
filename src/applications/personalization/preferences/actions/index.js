import localStorage from 'platform/utilities/storage/localStorage';

export const DASHBOARD_PREFERENCE_SET = 'DASHBOARD_PREFERENCE_SET';
export const DASHBOARD_PREFERENCES_SAVED = 'DASHBOARD_PREFERENCES_SAVED';
export const DASHBOARD_PREFERENCES_FETCHED = 'DASHBOARD_PREFERENCES_FETCHED';

export function fetchPreferences() {
  const savedPrefs = localStorage.getItem('dashboard-preferences');
  localStorage.setItem('dashboardLastVisitedAt', Date.now());

  return {
    type: DASHBOARD_PREFERENCES_FETCHED,
    data: (savedPrefs && JSON.parse(savedPrefs)) || {},
  };
}

export function setPreference(slug, value = true) {
  return {
    type: DASHBOARD_PREFERENCE_SET,
    slug,
    value,
  };
}

export function savePreferences(data) {
  // TODO: persist preferences to API
  localStorage.setItem('dashboard-preferences', JSON.stringify(data));

  return {
    type: DASHBOARD_PREFERENCES_SAVED,
    data,
  };
}

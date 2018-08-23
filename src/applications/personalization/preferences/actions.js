import localStorage from '../../../platform/utilities/storage/localStorage';

export const DASHBOARD_PREFERENCE_SET = 'DASHBOARD_PREFERENCE_SET';
export const DASHBOARD_PREFERENCES_SAVED = 'DASHBOARD_PREFERENCES_SAVED';

export function setPreference(slug, value = true) {
  return {
    type: DASHBOARD_PREFERENCE_SET,
    slug,
    value,
  };
}

export function savePreferences(data) {
  // TODO: persist preferences to API
  localStorage.setItem('dashboard-preferences', data);

  return {
    type: DASHBOARD_PREFERENCES_SAVED,
    data,
  };
}

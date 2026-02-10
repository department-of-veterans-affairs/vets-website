import { trackSaveFormClick } from './datadogRumTracking';

export const trackingSaveFormLink = getTrackingContext => onFormExit => formData => {
  const nextFormData =
    typeof onFormExit === 'function' ? onFormExit(formData) : formData;
  const { featureToggles, pathname } = getTrackingContext() || {};

  try {
    trackSaveFormClick({ featureToggles, pathname });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Tracking Error]', error);
  }

  return nextFormData;
};

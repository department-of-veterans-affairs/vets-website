import { trackSaveFormClick } from './datadogRumTracking';

export const trackingSaveFormLink = onFormExit => formData => {
  const nextFormData =
    typeof onFormExit === 'function' ? onFormExit(formData) : formData;

  try {
    trackSaveFormClick();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Tracking Error]', error);
  }

  return nextFormData;
};

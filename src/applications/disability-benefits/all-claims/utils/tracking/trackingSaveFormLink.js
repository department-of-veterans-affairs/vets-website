import { trackSaveFormClick } from './datadogRumTracking';

export const trackingSaveFormLink = onFormExit => formData => {
  const nextFormData =
    typeof onFormExit === 'function' ? onFormExit(formData) : formData;

  trackSaveFormClick();

  return nextFormData;
};

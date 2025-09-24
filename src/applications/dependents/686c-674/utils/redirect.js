import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

export function getShouldUseV2(isV2FlipperEnabled, savedForms) {
  const hasV1Form = savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_21_686C,
  );
  const hasV2Form = savedForms.some(
    form => form.form === VA_FORM_IDS.FORM_21_686CV2,
  );

  return isV2FlipperEnabled && (hasV2Form || !hasV1Form);
}

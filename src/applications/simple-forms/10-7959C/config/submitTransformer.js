/* eslint-disable camelcase */
import { transformForSubmit as formsSystemTransformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transformForSubmit(formConfig, form) {
  const transformedData = JSON.parse(
    formsSystemTransformForSubmit(formConfig, form),
  );

  // ------------------------------------------------------------------------ //
  // ------------------ Make changes to transformedData here ---------------- //

  const dataPostTransform = { ...transformedData };

  // ------------------------------------------------------------------------ //

  return JSON.stringify({ ...dataPostTransform });
}

import { transformForSubmit as platformTransformForSubmit } from 'platform/forms-system/exportsFile';

const transformForSubmit = (formConfig, form) =>
  platformTransformForSubmit(formConfig, form);

export default transformForSubmit;

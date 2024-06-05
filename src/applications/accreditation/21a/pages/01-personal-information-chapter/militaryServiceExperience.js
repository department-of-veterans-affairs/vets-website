import militaryServiceSchema from './militaryServiceSchema';

/** @type {PageSchema} */
export default {
  title: 'Military service experience',
  path: 'military-service-experience',
  depends: form => form.militaryHistory,
  ...militaryServiceSchema,
};

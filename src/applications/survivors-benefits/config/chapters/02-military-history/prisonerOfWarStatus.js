import { prisonerOfWar, powPeriodOfTime } from './prisonerOfWarPeriod';

/** @type {PageSchema} */
const prisonerOfWarPage = {
  title: 'Prisoner of war',
  path: 'veteran/prisoner-of-war',
  uiSchema: prisonerOfWar.uiSchema,
  schema: prisonerOfWar.schema,
};

/** @type {PageSchema} */
const powPeriodOfTimePage = {
  title: 'Prisoner of war period',
  path: 'veteran/prisoner-of-war-period',
  depends: formData => formData?.prisonerOfWar === true,
  uiSchema: powPeriodOfTime.uiSchema,
  schema: powPeriodOfTime.schema,
};

export { prisonerOfWarPage, powPeriodOfTimePage };

/**
 * @module pages
 * @description Barrel export for all page configurations
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

export { default as nameAndDateOfBirth } from './nameAndDateOfBirth';
export { examinationDateSchema, examinationDateUiSchema } from './exam-date';
export { diagnosisSchema, diagnosisUiSchema } from './diagnosis';
export { disabilitiesSchema, disabilitiesUiSchema } from './disabilities';
export {
  physicalMeasurementsSchema,
  physicalMeasurementsUiSchema,
} from './physical-measurements';
export { nutritionSchema, nutritionUiSchema } from './nutrition';
export { gaitSchema, gaitUiSchema } from './gait';
export { vitalSignsSchema, vitalSignsUiSchema } from './vital-signs';
export {
  bedConfinementSchema,
  bedConfinementUiSchema,
} from './bed-confinement';
export {
  assistanceWithActivitiesSchema,
  assistanceWithActivitiesUiSchema,
} from './assistance-with-activities';

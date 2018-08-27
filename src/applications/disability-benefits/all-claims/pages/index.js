import {
  uiSchema as alternateNamesUISchema,
  schema as alternateNamesSchema
} from './alternateNames';

import {
  uiSchema as servicePayUISchema,
  schema as servicePaySchema
} from '../pages/servicePay';

import {
  uiSchema as waiveRetirementPayUISchema,
  schema as waiveRetirementPaySchema
} from '../pages/waiveRetirementPay';


export const alternateNames = {
  uiSchema: alternateNamesUISchema,
  schema: alternateNamesSchema
};

export const servicePay = {
  uiSchema: servicePayUISchema,
  schema: servicePaySchema
};

export const waiveRetirementPay = {
  uiSchema: waiveRetirementPayUISchema,
  schema: waiveRetirementPaySchema
};

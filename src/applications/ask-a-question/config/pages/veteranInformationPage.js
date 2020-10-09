import { veteranStatusUI, requireServiceInfo } from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { personInformationUI } from './personInformationUI';

import { schema } from 'platform/forms/definitions/address';
import fullSchema from '../../0873-schema.json';

const { veteranStatus, veteranServiceInformation } = fullSchema.properties;

const formFields = {
  veteranStatus: 'veteranStatus',
  veteranInformation: 'veteranInformation',
  veteranServiceInformation: 'veteranServiceInformation',
};

const showVeteranInformation = formData => {
  return (
    formData.veteranStatus.veteranStatus &&
    (formData.veteranStatus.veteranStatus === 'behalf of vet' ||
      formData.veteranStatus.veteranStatus === 'dependent') &&
    (formData.veteranStatus.relationshipToVeteran &&
      formData.veteranStatus.relationshipToVeteran !== 'Veteran')
  );
};

const showDependentInformation = formData => {
  return (
    formData.veteranStatus.veteranStatus &&
    formData.veteranStatus.veteranStatus === 'dependent' &&
    formData.veteranStatus.isDependent !== undefined &&
    !formData.veteranStatus.isDependent
  );
};

const veteranInformationPage = {
  uiSchema: {
    [formFields.veteranStatus]: {
      ...veteranStatusUI,
    },
    [formFields.dependentInformation]: {
      ...personInformationUI('Dependent'),
      'ui:options': {
        hideIf: formData => !showDependentInformation(formData),
      },
    },
    [formFields.veteranInformation]: {
      ...personInformationUI('Veteran'),
      'ui:options': {
        hideIf: formData => !showVeteranInformation(formData),
      },
    },
    [formFields.veteranServiceInformation]: {
      ...veteranServiceInformationUI,
      'ui:options': {
        hideIf: formData =>
          !requireServiceInfo(formData.veteranStatus.veteranStatus),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [formFields.veteranStatus]: veteranStatus,
      [formFields.dependentInformation]: {
        type: 'object',
        properties: {
          first: {
            $ref: '#/definitions/first',
          },
          last: {
            $ref: '#/definitions/last',
          },
          address: schema(fullSchema),
          phone: {
            $ref: '#/definitions/phone',
          },
          email: {
            $ref: '#/definitions/email',
          },
        },
      },
      [formFields.veteranInformation]: {
        type: 'object',
        properties: {
          first: {
            $ref: '#/definitions/first',
          },
          last: {
            $ref: '#/definitions/last',
          },
          address: schema(fullSchema),
          phone: {
            $ref: '#/definitions/phone',
          },
          email: {
            $ref: '#/definitions/email',
          },
        },
      },
      [formFields.veteranServiceInformation]: veteranServiceInformation,
    },
  },
};

export default veteranInformationPage;

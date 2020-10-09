import { veteranStatusUI, requireServiceInfo } from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { personalInformationUI } from './personalInformationUI';
import _ from 'lodash';
import { schema } from 'platform/forms/definitions/address';
import fullSchema from '../../0873-schema.json';

const {
  veteranStatus,
  dependentInformation,
  veteranInformation,
  veteranServiceInformation,
} = fullSchema.properties;

const formFields = {
  veteranStatus: 'veteranStatus',
  dependentInformation: 'dependentInformation',
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
      ...personalInformationUI('Dependent'),
      'ui:options': {
        hideIf: formData => !showDependentInformation(formData),
      },
    },
    [formFields.veteranInformation]: {
      ...personalInformationUI('Veteran'),
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
      [formFields.dependentInformation]: _.set(
        dependentInformation,
        'properties.address',
        schema(fullSchema),
      ),
      [formFields.veteranInformation]: _.set(
        veteranInformation,
        'properties.address',
        schema(fullSchema),
      ),
      [formFields.veteranServiceInformation]: veteranServiceInformation,
    },
  },
};

export default veteranInformationPage;

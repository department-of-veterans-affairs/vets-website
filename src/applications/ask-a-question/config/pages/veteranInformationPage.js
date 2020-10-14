import { veteranStatusUI, requireServiceInfo } from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { dependentInformationUI } from './dependentInformationUI';
import _ from 'lodash';
import { schema } from 'platform/forms/definitions/address';
import fullSchema from '../../0873-schema.json';
import { veteranInformationUI } from './veteranInformationUI';

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

const hideVeteranInformation = formData => {
  return !showVeteranInformation(formData);
};

const showDependentInformation = formData => {
  return (
    formData.veteranStatus.veteranStatus &&
    formData.veteranStatus.veteranStatus === 'dependent' &&
    formData.veteranStatus.isDependent !== undefined &&
    !formData.veteranStatus.isDependent
  );
};

const hideDependentInformation = formData => {
  return !showDependentInformation(formData);
};

const veteranInformationPage = {
  uiSchema: {
    [formFields.veteranStatus]: {
      ...veteranStatusUI,
    },
    [formFields.dependentInformation]: {
      ...dependentInformationUI(showDependentInformation),
      'ui:options': {
        hideIf: formData => hideDependentInformation(formData),
      },
    },
    [formFields.veteranInformation]: {
      ...veteranInformationUI(showVeteranInformation),
      'ui:options': {
        hideIf: formData => hideVeteranInformation(formData),
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

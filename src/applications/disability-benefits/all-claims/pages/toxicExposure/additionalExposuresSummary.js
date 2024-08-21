import React from 'react';
import { ADDITIONAL_EXPOSURES, TE_URL_PREFIX } from '../../constants';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';
import { additionalExposuresPageTitle } from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(additionalExposuresPageTitle),
  'ui:description': ({ formData }) => (
    <ToxicExposureSummary
      formData={formData}
      checkboxObjectName="otherExposures"
      checkboxDefinitions={ADDITIONAL_EXPOSURES}
      datesObjectName="otherExposuresDetails"
      goBackDescription="go back and edit hazards and dates for Other toxic exposures"
      goBackUrlPath={`${TE_URL_PREFIX}/additional-exposures`}
      otherObjectName="specifyOtherExposures"
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};

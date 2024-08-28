import React from 'react';
import { ADDITIONAL_EXPOSURES, TE_URL_PREFIX } from '../../constants';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';
import {
  additionalExposuresPageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(additionalExposuresPageTitle, 'Summary'),
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

import React from 'react';
import { HERBICIDE_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';
import {
  herbicidePageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': titleWithSubtitle(herbicidePageTitle, 'Summary'),
  'ui:description': ({ formData }) => (
    <ToxicExposureSummary
      formData={formData}
      checkboxObjectName="herbicide"
      checkboxDefinitions={HERBICIDE_LOCATIONS}
      datesObjectName="herbicideDetails"
      goBackDescription="go back and edit locations and dates for Agent Orange locations"
      goBackUrlPath={`${TE_URL_PREFIX}/herbicide`}
      otherObjectName="otherHerbicideLocations"
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};

import React from 'react';
import { GULF_WAR_1990_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';
import { gulfWar1990PageTitle } from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(gulfWar1990PageTitle),
  'ui:description': ({ formData }) => (
    <ToxicExposureSummary
      formData={formData}
      checkboxObjectName="gulfWar1990"
      checkboxDefinitions={GULF_WAR_1990_LOCATIONS}
      datesObjectName="gulfWar1990Details"
      goBackDescription="go back and edit locations and dates for service after August 2, 1990"
      goBackUrlPath={`${TE_URL_PREFIX}/gulf-war-1990`}
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};

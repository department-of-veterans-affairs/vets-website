import React from 'react';
import { GULF_WAR_2001_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { gulfWar2001PageTitle } from '../../content/toxicExposure';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(gulfWar2001PageTitle),
  'ui:description': ({ formData }) => (
    <ToxicExposureSummary
      formData={formData}
      checkboxObjectName="gulfWar2001"
      checkboxDefinitions={GULF_WAR_2001_LOCATIONS}
      datesObjectName="gulfWar2001Details"
      goBackDescription="go back and edit locations and dates for service post-9/11"
      goBackUrlPath={`${TE_URL_PREFIX}/gulf-war-2001`}
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};

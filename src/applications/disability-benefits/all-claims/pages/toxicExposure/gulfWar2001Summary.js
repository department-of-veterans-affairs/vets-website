import React from 'react';
import { GULF_WAR_2001_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import {
  gulfWar2001PageTitle,
  titleWithSubtitle,
} from '../../content/toxicExposure';
import { ToxicExposureSummary } from '../../components/ToxicExposureSummary';

export const uiSchema = {
  'ui:title': titleWithSubtitle(gulfWar2001PageTitle, 'Summary'),
  'ui:description': ({ formData }) => (
    <ToxicExposureSummary
      formData={formData}
      checkboxObjectName="gulfWar2001"
      checkboxDefinitions={GULF_WAR_2001_LOCATIONS}
      datesObjectName="gulfWar2001Details"
      goBackUrlPath={`${TE_URL_PREFIX}/gulf-war-2001`}
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {},
};

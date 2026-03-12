import React from 'react';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { LandMarketableAlert } from '../../../components/FormAlerts';
import { isHomeAcreageMoreThanTwo } from '../../../helpers';

const { landMarketable } = fullSchemaPensions.properties;

const LandMarketableDescription = () => (
  <div>
    <p>We want to know if the additional land is marketable.</p>
    <LandMarketableAlert />
  </div>
);

/** @type {PageSchema} */
export default {
  title: 'Land marketable',
  path: 'financial/land-marketable',
  depends: isHomeAcreageMoreThanTwo,
  uiSchema: {
    ...titleUI('Additional land'),
    'ui:description': LandMarketableDescription,
    landMarketable: yesNoUI({
      title: 'Is the additional land marketable?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      landMarketable,
    },
  },
};

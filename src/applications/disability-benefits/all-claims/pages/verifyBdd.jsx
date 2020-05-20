import React from 'react';
import { activeServicePeriods } from '../utils';
import ServicePeriodView from 'platform/forms/components/ServicePeriodView';
import environment from 'platform/utilities/environment';

export const depends = formData =>
  !environment.isProduction() && !!activeServicePeriods(formData).length;

export const uiSchema = {
  'ui:title': 'Filing a claim before discharge',
  'ui:description': ({ formData }) => (
    <div>
      <p>
        According to your military service history, it looks like you’re still
        in the service.
      </p>
      <p>
        If your separation date is in the next 180 to 90 days, you can file a
        claim through the Benefits Delivery at Discharge (BDD) program on
        eBenefits.
      </p>
      <div>
        {activeServicePeriods(formData).map((sp, index) => (
          <div className="va-growable-background" key={index}>
            <ServicePeriodView formData={sp} />
          </div>
        ))}
      </div>
    </div>
  ),
  'view:verifyBdd': {
    'ui:title': 'Are your military service dates correct?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:verifyBdd': {
      type: 'boolean',
    },
  },
};

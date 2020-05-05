import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';

import { activeServicePeriods } from '../utils';

const content = (
  <>
    <p>
      You can update your service history dates on the previous screen. You
      won’t be able to submit your disability claim online unless you update
      your dates.
    </p>
    <div>
      <Link
        className="usa-button-primary va-button-primary"
        to="review-veteran-details/military-service-history"
      >
        Go back to military service history
      </Link>
    </div>
  </>
);

export const depends = formData =>
  !environment.isProduction() &&
  !!activeServicePeriods(formData).length &&
  !formData['view:verifyBdd'];

export const uiSchema = {
  'ui:title': 'Filing a claim before discharge',
  'ui:description': (
    <AlertBox
      status="error"
      headline="Please update your military service history"
      content={content}
    />
  ),
};

export const schema = {
  type: 'object',
  properties: {
    'view:bddGoBackWarning': { type: 'object', properties: {} },
  },
};

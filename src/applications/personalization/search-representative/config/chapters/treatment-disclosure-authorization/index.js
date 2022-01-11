import React from 'react';

import AuthorizationLimits from '../../../components/AuthorizationLimits';

const description =
  'Choose which protected treatment records you authorize your accredited representative to access.';

const AuthorizationsDescription = () => (
  <div className="vads-u-margin-y--3">
    Select <strong>all</strong> the treatment records you want to authorize.
    This isn’t required.
  </div>
);

export const schema = {
  type: 'object',
  properties: {
    'view:authorizationLimits': {
      type: 'object',
      properties: {},
    },
    authorizations: {
      type: 'object',
      properties: {
        drugAbuse: {
          type: 'boolean',
          title: 'Drug Abuse',
        },
        alcoholAbuse: {
          type: 'boolean',
          title: 'Alcoholism or alcohol use problems',
        },
        hiv: {
          type: 'boolean',
          title: 'Human immunodeficiency virus (HIV)',
        },
        sickleCellAnemia: {
          type: 'boolean',
          title: 'Sickle cell anemia',
        },
      },
    },
    'view:disclaimer': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'ui:description': description,
  'view:authorizationLimits': {
    'ui:field': AuthorizationLimits,
  },
  authorizations: {
    'ui:description': AuthorizationsDescription,
    drugAbuse: {},
    alcoholAbuse: {},
    hiv: {},
    sickleCellAnemia: {},
  },
  'view:disclaimer': {
    'ui:description':
      'You can continue without authorizing us to release any of these protected treatment records.',
  },
};

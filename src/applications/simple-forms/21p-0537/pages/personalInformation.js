import React from 'react';
import { PersonalInformation } from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import { pageFocusScroll } from '../helpers';

export default {
  path: 'contact/name',
  title: 'Personal information',
  CustomPage: props => <PersonalInformation {...props} />,
  CustomPageReview: null,
  hideOnReview: true,
  scrollAndFocusTarget: pageFocusScroll(),
  schema: {
    type: 'object',
    properties: {}, // Must be present even if empty
  },
  uiSchema: {},
};

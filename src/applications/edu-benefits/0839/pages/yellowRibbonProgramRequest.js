import React from 'react';
import YellowRibbonProgramDescription from '../components/YellowRibbonProgramDescription';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';

const uiSchema = {
  'ui:title': () => <YellowRibbonProgramTitle text="Tell us about your" />,
  'ui:description': YellowRibbonProgramDescription,
};

const schema = {
  type: 'object',
  properties: {},
};

export { uiSchema, schema };

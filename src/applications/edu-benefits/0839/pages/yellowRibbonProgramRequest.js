import React from 'react';
import YellowRibbonProgramDescription from '../components/YellowRibbonProgramDescription';
import YellowRibbonProgramTitle from '../components/YellowRibbonProgramTitle';

const uiSchema = {
  'ui:title': () => (
    <YellowRibbonProgramTitle
      eligibilityChapter={false}
      text="Tell us about your Yellow Ribbon Program contributions"
    />
  ),
  'ui:description': YellowRibbonProgramDescription,
};

const schema = {
  type: 'object',
  properties: {},
};

export { uiSchema, schema };

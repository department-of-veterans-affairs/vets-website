import React from 'react';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.serviceBefore1977;

export const uiSchema = {
  married: {
    'ui:title': 'Are you currently married?',
    'ui:widget': 'yesNo'
  },
  haveDependents: {
    'ui:title': 'Do you have any children who fall into these categories?',
    'ui:description': () => (
      <ul className="edu-benefits-dependents-desc">
        <li>Under age 18</li>
        <li>Between the ages of 18 and 22, not married, and attending school</li>
        <li>Any age who are permanently disabled for mental or physical reasons</li>
      </ul>
    ),
    'ui:widget': 'yesNo'
  },
  parentDependent: {
    'ui:title': 'Do you have a parent who is dependent on your financial support?',
    'ui:widget': 'yesNo'
  }
};

import React from 'react';

const uiSchema = {
  married: {
    'ui:title': 'Are you currently married?',
    'ui:widget': 'yesNo',
  },
  haveDependents: {
    'ui:title': 'Do you have any children who are:',
    'ui:description': (
      <ul className="edu-benefits-dependents-desc">
        <li>
          Under age 18, <b>or</b>
        </li>
        <li>
          Between the ages of 18 and 22, not married, and attending school,{' '}
          <b>or</b>
        </li>
        <li>Permanently physically or mentally disabled</li>
      </ul>
    ),
    'ui:widget': 'yesNo',
  },
  parentDependent: {
    'ui:title':
      'Do you have a parent who depends on you for financial support?',
    'ui:widget': 'yesNo',
  },
};

export default uiSchema;

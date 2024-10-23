import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipVeteran.pages.aboutYourRelationshipToFamilyMember_aboutsomeoneelserelationshipveteran;

describe('relationshipToFamilyMemberPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = [
      "They're my spouse",
      "They're my child",
      "They're my step child",
      "They're my parent",
      "We have a relationship that's not listed",
    ];

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'What is your relationship to the family member?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
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
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember.pages.familyMembersPostalCode_aboutsomeoneelserelationshipfamilymemberaboutfamilymember;

describe('familyMembersPostalCodePage', () => {
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
      </Provider>,
    );

    const titleText = "Family member's postal code";

    expect($('h3', container).textContent).to.eq(titleText);

    expect($('.usa-hint', container).textContent).to.eq(
      'We ask for this information to send your question to the right place or provide relevant resources.',
    );
  });
});

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../../fixtures/test-helpers/helpers';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember.pages.aboutYourFamilyMember_aboutsomeoneelserelationshipfamilymemberaboutfamilymember;

describe('aboutTheFamilyMemberPage', () => {
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

    const labels = $$('label', container);
    const labelList = [
      'First name',
      'Middle name',
      'Last name',
      'Suffix',
      'Preferred name',
      'Social Security number',
      'Month',
      'Day',
      'Year',
      'He/him/his',
      'She/her/hers',
      'They/them/theirs',
      'Ze/zir/zirs',
      'Use my preferred name',
      'If not listed, provide your preferred pronouns',
    ];

    expect($('h3', container).textContent).to.eq(
      'Tell us about your family member',
    );

    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent).trim()))
          .to.be.true,
    );
  });
});

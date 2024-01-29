import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../../config/form';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';
import { getData } from '../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.aboutYourself_generalquestion;

describe('aboutYourselfPage', () => {
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
      'Service number',
      'Month',
      'Day',
      'Year',
      'He/him/his',
      'She/her/hers',
      'They/them/theirs',
      'Ze/zir/zirs',
      'Use my preferred name',
      'If not listed, please provide your preferred pronouns',
      'Man',
      'Non-binary',
      'Transgender man',
      'Transgender woman',
      'Woman',
      'Prefer not to answer',
      'A gender not listed here',
    ];

    expect($('h4', container).textContent).to.eq('Tell us about yourself');

    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent).trim()))
          .to.be.true,
    );
  });
});

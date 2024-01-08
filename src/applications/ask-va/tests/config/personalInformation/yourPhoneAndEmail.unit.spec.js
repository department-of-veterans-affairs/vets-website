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
} = formConfig.chapters.personalInformation.pages.yourPhoneAndEmail;

describe('yourPhoneAndEmailPage', () => {
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

    const labels = $$('.schemaform-field-template > label', container);
    const labelList = ['Phone', 'Email address'];

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = ['Phone', 'Email', 'U.S. mail'];
    const radioQuestion = removeReqFromLabel(
      $('#root_howToContact-label', container).textContent,
    );

    expect($('h4', container).textContent).to.eq('Your phone number and email');
    expect(radioQuestion).to.eq('How should we contact you?');

    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent))).to.be
          .true,
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});

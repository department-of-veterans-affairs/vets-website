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
import { getData } from '../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.whoThisIsAbout_familysomeonesbenefits;

describe('whoHasAQuestionPage', () => {
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
    const radioLabelList = ['About the Veteran', 'About someone else'];

    expect($('h3', container).textContent).to.eq('Who your question is about');

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});

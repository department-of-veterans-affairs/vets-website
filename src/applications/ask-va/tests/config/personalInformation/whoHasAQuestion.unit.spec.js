import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../config/form';
import { getData } from '../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.isQuestionAboutVeteranOrSomeoneElse_aboutsomeoneelserelationshipfamilymember;

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
    const radioLabelList = ['Veteran', 'Someone else'];

    expect($('h3', container).textContent).to.eq(
      'Is your question about the Veteran or someone else?',
    );

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});

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
} = formConfig.chapters.vaInformation.pages.whoHasAQuestion;

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
    const radioLabelList = [
      'Yes',
      'No',
      'A general question',
      'About me, the Veteran',
      'For the dependent of a Veteran',
      'On behalf of the Veteran',
    ];

    const legends = $$('legend', container);
    const legendList = [
      'Are you currently an employee of the VA?',
      'Who are you asking a question for?',
    ];

    expect($('h3', container).textContent).to.eq('Tell us who has a question');

    radioLabels.forEach(
      radio =>
        expect(radioLabelList.includes(removeReqFromLabel(radio.textContent)))
          .to.be.true,
    );

    legends.forEach(
      legend =>
        expect(legendList.includes(removeReqFromLabel(legend.textContent))).to
          .be.true,
    );
  });
});

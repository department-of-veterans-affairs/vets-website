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
} = formConfig.chapters.personalInformation.pages.relationshipToVeteran;

describe('isTheVeteranDeceasedPage', () => {
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
      'GI Bill beneficiary',
      'Other personal relationship',
      'On-the-job training or apprenticeship supervisor',
      'School Certifying Official',
      'VA employee',
      'Work study site supervisor',
      'Other business relationship',
    ];

    expect($('h4', container).textContent).to.eq(
      'Your relationship to the Veteran',
    );
    radioLabels.forEach(
      radio =>
        expect(radioLabelList.includes(removeReqFromLabel(radio.textContent)))
          .to.be.true,
    );
  });
});

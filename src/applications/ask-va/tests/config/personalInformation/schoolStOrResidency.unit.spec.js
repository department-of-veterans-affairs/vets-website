import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import { getData } from '../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';

// const {
//   schema,
//   uiSchema,
// } = formConfig.chapters.personalInformation.pages.schoolStOrResidency_aboutmyselfrelationshipveteran;

describe('schoolStOrResidencyPage', () => {
  // Skipping since we are not currently using this yet in the form for accessiblity testing
  it.skip('should render', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          // schema={schema}
          // uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    const labels = $$('label', container);
    const labelList = ['School state', 'Residency state'];

    expect($('h3', container).textContent).to.eq('School information');
    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent))).to.be
          .true,
    );
  });
});

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
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
// } = formConfig.chapters.personalInformation.pages.stateOfSchool_aboutmyselfrelationshipveteran;

describe('stateOfSchoolPage', () => {
  // Skipping since we are not currently using this in form yet
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

    const label = $('label', container);

    expect($('h3', container).textContent).to.eq('State of school');
    expect(removeReqFromLabel(label.textContent)).to.eq('Select state');
  });
});

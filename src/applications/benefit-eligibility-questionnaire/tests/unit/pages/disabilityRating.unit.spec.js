import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { getData } from '../mocks/mockFormData';
import disabilityRatingConfig from '../../../pages/disabilityRating';

describe('disabilityRating page', () => {
  it('should render the correct radio component', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={disabilityRatingConfig.schema}
          uiSchema={disabilityRatingConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    expect($('va-radio', container)).to.exist;
  });
});

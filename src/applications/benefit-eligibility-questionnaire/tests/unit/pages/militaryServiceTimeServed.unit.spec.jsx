import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { getData } from '../mocks/mockFormData';
import militaryServiceTotalTimeServedConfig from '../../../pages/militaryServiceTimeServed';

describe('Military Service Total Time Served Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={militaryServiceTotalTimeServedConfig.schema}
        uiSchema={militaryServiceTotalTimeServedConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for militaryServiceTotalTimeServed', () => {
    const title = document.querySelector(
      'va-radio[label="In total, how long have you served in the military?"]',
    );
    expect(title).to.exist;
  });

  it('should not display any error message by default', () => {
    const errorMessage = wrapper.queryByText(
      'Please select an option for total time served in the military',
    );
    expect(errorMessage).to.not.exist;
  });

  it('should render the correct radio component', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={militaryServiceTotalTimeServedConfig.schema}
          uiSchema={militaryServiceTotalTimeServedConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    expect($('va-radio', container)).to.exist;
  });
});

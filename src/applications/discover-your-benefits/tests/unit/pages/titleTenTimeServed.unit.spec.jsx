import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import { getData } from '../mocks/mockFormData';
import titleTenTimeServedConfig from '../../../pages/titleTenTimeServed';
import { timeServedTypes, timeServedLabels } from '../../../constants/benefits';

describe('Military Service Total Time Served Form', () => {
  let wrapper;

  const setupForm = (data = {}) =>
    render(
      <DefinitionTester
        schema={titleTenTimeServedConfig.schema}
        uiSchema={titleTenTimeServedConfig.uiSchema}
        data={data}
      />,
    );

  beforeEach(() => {
    wrapper = setupForm();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render the correct title for titleTenTimeServed', () => {
    const title = document.querySelector(
      'va-radio[label="How long were you called up to active-duty (Title 10) orders while serving in the National Guard or Reserves?"]',
    );
    expect(title).to.exist;
  });

  it('should render the correct hint for titleTenTimeServed', () => {
    const hint = document.querySelector(
      'va-radio[hint="This includes activations, deployments, and mobilizations under Title 10 orders."]',
    );
    expect(hint).to.exist;
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
          schema={titleTenTimeServedConfig.schema}
          uiSchema={titleTenTimeServedConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    expect($('va-radio', container)).to.exist;
  });

  it('should render the correct labels and values in radio select', () => {
    const types = Object.values(timeServedTypes);
    const labels = Object.values(timeServedLabels);
    for (let i = 0; i < types.length; i++) {
      const queryString = `va-radio-option[label='${labels[i]}'][value=${
        types[i]
      }]`.replace('+', '+\\');
      const radioOption = document.querySelector(queryString);
      expect(radioOption).to.exist;
    }
  });
});

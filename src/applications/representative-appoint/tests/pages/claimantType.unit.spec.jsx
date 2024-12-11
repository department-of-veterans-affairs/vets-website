import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ClaimantType from '../../components/ClaimantType';
import initialFormData from '../fixtures/data/initial-form-data.json';

describe('<ClaimantType /> handlers', async () => {
  const getProps = () => {
    return {
      props: {
        setFormData: sinon.spy(),
        formData: initialFormData,
      },
      mockStore: {
        getState: () => ({
          form: {
            data: initialFormData,
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
  };

  const renderContainer = (props, mockStore) => {
    return render(
      <Provider store={mockStore}>
        <ClaimantType {...props} />
      </Provider>,
    );
  };

  it('should render', async () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);

    const radioButtonYes = container.querySelector(
      'va-radio-option[value="Yes"]',
    );

    const radioButtonNo = container.querySelector(
      'va-radio-option[value="No"]',
    );
    expect(radioButtonYes).to.exist;
    expect(radioButtonNo).to.exist;
  });
});

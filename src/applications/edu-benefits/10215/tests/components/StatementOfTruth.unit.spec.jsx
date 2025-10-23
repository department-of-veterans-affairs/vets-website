import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import StatementOfTruth from '../../components/StatementOfTruth';

const signatureProps = {
  formData: {
    signatureOfficialTitle: 'Test official title',
    signature: 'Test name',
    AGREED: true,
  },
  onSectionComplete: () => {},
};

describe('<StatementOfTruth />', () => {
  const mockStore = configureStore([]);

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <StatementOfTruth {...signatureProps} />
      </Provider>,
    );

    expect($('h3', container)).to.exist;
  });
  it('should render with no form data', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <StatementOfTruth {...signatureProps} formData={{}} />
      </Provider>,
    );

    expect($('h3', container)).to.exist;
  });
});

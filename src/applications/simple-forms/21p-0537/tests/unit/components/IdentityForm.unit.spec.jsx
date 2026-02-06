import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import IdentityForm from '../../../components/IdentityPage/IdentityForm';

describe('21P-0537 <IdentityForm>', () => {
  const getData = () => ({
    props: {
      data: {},
      onLogin: () => {},
      onChange: () => {},
      onSubmit: () => {},
    },
    mockStore: {
      getState: () => {},
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the component renders', () => {
    const { mockStore, props } = getData();

    it('should render the submit button', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityForm {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.idform-submit-button');
      expect(selector).to.exist;
    });
  });
});

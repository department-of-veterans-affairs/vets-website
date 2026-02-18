import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as scrollModule from 'platform/utilities/scroll/scroll';
import IncorrectForm from '../../../containers/IncorrectForm';

describe('Incorrect form page', () => {
  const getProps = () => {
    return {
      mockStore: {
        getState: () => ({
          form: { data: {} },
          user: { login: { currentlyLoggedIn: false } },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
  };
  it('renders the incorrect form information', async () => {
    const scrollToTop = sinon.stub(scrollModule, 'scrollTo');
    const { mockStore } = getProps();
    const { container } = render(
      <Provider store={mockStore}>
        <div name="topScrollElement" />
        <div id="nav-form-header" />
        <IncorrectForm />
      </Provider>,
    );
    await waitFor(() => {
      expect(scrollToTop.calledWith('topScrollElement')).to.be.true;
    });
    expect(container.querySelector('h3')).to.have.text(
      'This might not be the right form for you',
    );
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(3);
    expect(container.querySelectorAll('va-link-action')).to.have.lengthOf(1);
  });
});

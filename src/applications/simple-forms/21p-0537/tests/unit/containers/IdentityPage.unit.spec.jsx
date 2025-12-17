/* eslint-disable camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import formConfig from '../../../config/form';
import IdentityPage from '../../../containers/IdentityPage';

describe('21P-0537 IdentityPage', () => {
  const getData = () => ({
    props: {
      router: {
        push: sinon.spy(),
      },
      route: {
        pageList: [{ path: '/current-page' }, { path: '/next', formConfig }],
      },
      location: {
        pathname: '/current-page',
      },
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {},
        },
        user: {
          login: {},
          profile: {
            loading: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ props, mockStore }) => {
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <IdentityPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      form: container.querySelector('.rjsf'),
      buttons: {
        submit: container.querySelector('.idform-submit-button'),
      },
    });
    return { container, rerender, selectors };
  };

  it('should render the submit button and form when the page renders', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { form, buttons } = selectors();
    expect(form).to.exist;
    expect(buttons.submit).to.exist;
  });

  it('should find and click submit button', async () => {
    const { props, mockStore } = getData();
    const { container, selectors } = subject({ props, mockStore });
    const dataToSet = {
      fullName_first: 'John',
      fullName_last: 'Doe',
      phone: '1231231234',
      email: 'test@email.gov',
    };

    for (const [key, value] of Object.entries(dataToSet)) {
      const el = container.querySelector(`va-text-input[name='root_${key}']`);

      el.value = value;

      const event = new CustomEvent('input', {
        detail: { value },
        bubbles: true,
      });
      el.dispatchEvent(event);
    }

    fireEvent.click(selectors().buttons.submit);
  });
});

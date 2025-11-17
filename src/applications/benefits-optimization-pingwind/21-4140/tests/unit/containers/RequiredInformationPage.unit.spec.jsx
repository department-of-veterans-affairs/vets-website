import React from 'react';
import { Provider } from 'react-redux';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import RequiredInformationPage from '../../../containers/RequiredInformationPage';
import { SET_DATA } from 'platform/forms-system/src/js/actions';

const createStore = (formData = {}, dispatch = () => {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch,
});

const defaultRoute = {
  pageList: [
    { path: 'introduction', pageKey: 'introduction' },
    { path: 'required-information', pageKey: 'required-information' },
    { path: 'section-one', pageKey: 'section-one' },
  ],
};

const defaultLocation = { pathname: 'required-information' };

describe('21-4140 container/RequiredInformationPage', () => {
  let sandbox;
  let user;
  let originalScrollTo;
  let hadScrollTo;

  const renderPage = ({
    formData,
    location = defaultLocation,
    route = defaultRoute,
    router = { push: sandbox.spy() },
    dispatch = sandbox.spy(),
  } = {}) => {
    const store = createStore(formData, dispatch);
    const utils = render(
      <Provider store={store}>
        <RequiredInformationPage
          location={location}
          route={route}
          router={router}
        />
      </Provider>,
    );

    return {
      ...utils,
      router,
      dispatch,
    };
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    hadScrollTo = Object.prototype.hasOwnProperty.call(
      document.body,
      'scrollTo',
    );
    originalScrollTo = document.body.scrollTo;
    if (!originalScrollTo) {
      document.body.scrollTo = () => {};
      originalScrollTo = document.body.scrollTo;
    }
    sandbox.stub(document.body, 'scrollTo');
    user = userEvent;
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('prevents navigation and shows an error when the acknowledgement is missing', async () => {
    const { container, findByRole, router } = renderPage();

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(router.push.called).to.be.false;

    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox?.getAttribute('error')).to.equal(
      'You must confirm you have read this statement to continue.',
    );
  });

  it('stores the acknowledgement and moves forward when confirmed', async () => {
    const dispatch = sandbox.spy();
    const router = { push: sandbox.spy() };

    const { container, findByRole } = renderPage({ dispatch, router });

    const checkbox = container.querySelector('va-checkbox');
    act(() => {
      checkbox?.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );
    });

    expect(
      dispatch.calledWithMatch({
        type: SET_DATA,
        data: {
          requiredInformation: {
            acknowledged: true,
          },
        },
      }),
    ).to.be.true;

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(router.push.calledWith('section-one')).to.be.true;
  });

  it('navigates back to the previous page when the Back button is pressed', async () => {
    const router = { push: sandbox.spy() };
    const { findByRole } = renderPage({ router });

    const backButton = await findByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(router.push.calledWith('introduction')).to.be.true;
  });
});

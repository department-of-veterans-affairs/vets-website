import React from 'react';
import { Provider } from 'react-redux';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSectionOnePage from '../../../containers/PreSectionOnePage';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const defaultRoute = {
  pageList: [
    { path: 'introduction', pageKey: 'introduction' },
    { path: 'form-verification', pageKey: 'form-verification' },
    { path: 'required-information', pageKey: 'required-information' },
  ],
};

const defaultLocation = { pathname: 'form-verification' };

let sandbox;
const createSpy = () => (sandbox ? sandbox.spy() : sinon.spy());

const renderPage = ({
  formData,
  location = defaultLocation,
  route = defaultRoute,
  router = { push: createSpy() },
} = {}) => {
  const store = createStore(formData);
  const utils = render(
    <Provider store={store}>
      <PreSectionOnePage location={location} route={route} router={router} />
    </Provider>,
  );

  return {
    ...utils,
    router,
  };
};

describe('21-4140 container/PreSectionOnePage', () => {
  let originalScrollTo;
  let user;
  let hadScrollTo;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    user = userEvent;
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
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('requires a selection before continuing', async () => {
    const { container, findByRole } = renderPage();

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    const radioGroup = container.querySelector('va-radio');
    expect(radioGroup?.getAttribute('error')).to.equal(
      'You must make a selection. This field is required.',
    );
  });

  it('advances to the next route when "yes" is selected', async () => {
    const { container, router, findByRole } = renderPage();

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'yes' },
          bubbles: true,
        }),
      );
    });

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(router.push.calledWith('required-information')).to.be.true;
  });

  it('shows the warning alert when "no" is selected and prevents navigation', async () => {
    const { container, router, findByRole } = renderPage();

    const radio = container.querySelector('va-radio');
    act(() => {
      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'no' },
          bubbles: true,
        }),
      );
    });

    const alert = container.querySelector('#employment-status-alert');
    expect(alert).to.exist;

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(router.push.called).to.be.false;
  });
});

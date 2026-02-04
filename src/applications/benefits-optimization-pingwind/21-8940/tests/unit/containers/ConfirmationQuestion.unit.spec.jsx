import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationQuestion from '../../../containers/ConfirmationQuestion';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: sinon.spy(),
});

describe('21-8940 container/ConfirmationQuestion', () => {
  let sandbox;
  let user;
  let hadScrollTo;
  let originalScrollTo;

  const defaultRoute = {
    pageList: [
      { path: 'introduction', pageKey: 'introduction' },
      { path: 'confirmation-question', pageKey: 'confirmationQuestion' },
      { path: 'important-information', pageKey: 'importantInformation' },
    ],
  };

  const defaultLocation = { pathname: 'confirmation-question' };

  const renderPage = ({
    formData = {},
    location = defaultLocation,
    route = defaultRoute,
    router = { push: sandbox.spy() },
  } = {}) => {
    const store = createStore(formData);
    const utils = render(
      <Provider store={store}>
        <ConfirmationQuestion
          location={location}
          route={route}
          router={router}
        />
      </Provider>,
    );

    return {
      ...utils,
      router,
      store,
    };
  };

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
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('navigates back to introduction when back button is clicked', async () => {
    const { getByRole, router } = renderPage();
    const routerPush = router.push;

    const backButton = getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('/introduction');
  });

  it('shows error when attempting to continue without answering confirmation question', async () => {
    const { getByRole, container } = renderPage();

    const continueButton = getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      const confirmationRadio = container.querySelector(
        '#confirmation-question',
      );
      expect(confirmationRadio.getAttribute('error')).to.equal(
        'You must make a selection to proceed.',
      );
    });
  });

  it('allows user to continue when confirmation is pre-set to "Yes"', async () => {
    const formData = { confirmationQuestion: true };
    const { getByRole, router } = renderPage({ formData });
    const routerPush = router.push;

    const continueButton = getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(routerPush.called).to.be.true;
      expect(routerPush.firstCall?.args?.[0]).to.equal('important-information');
    });
  });

  it('renders radio buttons for confirmation question', () => {
    const { container } = renderPage();

    const confirmationRadio = container.querySelector('#confirmation-question');
    expect(confirmationRadio).to.exist;
    expect(confirmationRadio.getAttribute('label')).to.equal(
      'Are you applying for increased compensation due to unemployability?',
    );
  });

  it('renders with confirmation question set to false', () => {
    const formData = { confirmationQuestion: false };
    const { container } = renderPage({ formData });

    const confirmationRadio = container.querySelector('#confirmation-question');
    expect(confirmationRadio).to.exist;
  });

  it('renders with both questions answered', () => {
    const formData = {
      confirmationQuestion: false,
      newConditionQuestion: true,
    };
    const { container } = renderPage({ formData });

    expect(container.querySelector('#confirmation-question')).to.exist;
  });

  it('renders with pre-existing form data', () => {
    const formData = {
      confirmationQuestion: true,
    };

    const { getByRole } = renderPage({ formData });

    expect(
      getByRole('heading', {
        level: 1,
        name: 'Let’s confirm VA Form 21-8940 is the right form for your needs',
      }),
    ).to.exist;
  });

  it('handles router.push being undefined gracefully', async () => {
    const { getByRole } = renderPage({ router: {} });

    const backButton = getByRole('button', { name: /back/i });
    await user.click(backButton);

    // Should not throw an error
    expect(backButton).to.exist;
  });
});

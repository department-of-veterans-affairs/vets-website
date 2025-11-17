import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import ImportantInformation from '../../../containers/ImportantInformation';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('21-8940 container/ImportantInformation', () => {
  let sandbox;
  let user;
  let hadScrollTo;
  let originalScrollTo;
  let bodyScrollStub;

  const defaultRoute = {
    pageList: [
      { path: 'confirmation-question', pageKey: 'confirmationQuestion' },
      { path: 'important-information', pageKey: 'importantInformation' },
      { path: 'what-you-need', pageKey: 'whatYouNeed' },
    ],
  };

  const defaultLocation = { pathname: 'important-information' };

  const renderPage = ({
    formData = {},
    location = defaultLocation,
    route = defaultRoute,
    router = { push: sandbox.spy() },
  } = {}) => {
    const store = createStore(formData);
    const utils = render(
      <Provider store={store}>
        <ImportantInformation
          location={location}
          route={route}
          router={router}
        />
      </Provider>,
    );

    return {
      ...utils,
      router,
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
    bodyScrollStub = sandbox.stub(document.body, 'scrollTo');
  });

  afterEach(() => {
    sandbox.restore();
    if (hadScrollTo) {
      document.body.scrollTo = originalScrollTo;
    } else {
      delete document.body.scrollTo;
    }
  });

  it('renders page content and scrolls to top', async () => {
    const { container, getByText } = renderPage();

    await waitFor(() => {
      expect(bodyScrollStub.called).to.be.true;
    });

    const heading = container.querySelector('h2.vads-u-margin-bottom--2');
    expect(heading).to.exist;
    expect(heading.textContent).to.include('Veteran');

    expect(
      getByText(
        'This is an application for compensation benefits based on unemployability',
      ),
    ).to.exist;
  });

  it('displays the important information summary box', () => {
    const { getByText } = renderPage();

    expect(
      getByText('Please read this important information before you start:'),
    ).to.exist;
    expect(getByText(/This form may take about 45-55 minutes to complete/)).to
      .exist;
    expect(getByText(/You must answer all questions fully and accurately/)).to
      .exist;
    expect(
      getByText(/You can save your progress and come back to this form later/),
    ).to.exist;
    expect(
      getByText(
        /This form is for claiming total disability if service-connected disabilities have prevented you from getting or keeping a job/,
      ),
    ).to.exist;
  });

  it('navigates back when back button is clicked', async () => {
    const { getByRole, router } = renderPage();
    const routerPush = router.push;

    const backButton = getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('confirmation-question');
  });

  it('navigates forward when continue button is clicked', async () => {
    const { getByRole, router } = renderPage();
    const routerPush = router.push;

    const continueButton = getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('what-you-need');
  });

  it('handles router.push being undefined gracefully on back', async () => {
    const { getByRole } = renderPage({ router: {} });

    const backButton = getByRole('button', { name: /back/i });
    await user.click(backButton);

    // Should not throw an error
    expect(backButton).to.exist;
  });

  it('handles router.push being undefined gracefully on forward', async () => {
    const { getByRole } = renderPage({ router: {} });

    const continueButton = getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    // Should not throw an error
    expect(continueButton).to.exist;
  });

  it('renders with form data', () => {
    const formData = {
      veteranFullName: {
        first: 'John',
        last: 'Doe',
      },
    };

    const { container } = renderPage({ formData });

    const heading = container.querySelector('h2.vads-u-margin-bottom--2');
    expect(heading).to.exist;
    expect(heading.textContent).to.include('Veteran');
  });

  it('renders the VaSummaryBox component', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector(
      '#important-information-summary',
    );
    expect(summaryBox).to.exist;
  });

  it('renders navigation buttons', () => {
    const { getByRole } = renderPage();

    expect(getByRole('button', { name: /back/i })).to.exist;
    expect(getByRole('button', { name: /continue/i })).to.exist;
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import WhatYouNeed from '../../../containers/WhatYouNeed';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('21-8940 container/WhatYouNeed', () => {
  let sandbox;
  let user;
  let hadScrollTo;
  let originalScrollTo;
  let bodyScrollStub;

  const defaultRoute = {
    pageList: [
      { path: 'important-information', pageKey: 'importantInformation' },
      { path: 'what-you-need', pageKey: 'whatYouNeed' },
      {
        path: 'information-required-page',
        pageKey: 'informationRequiredPage',
      },
    ],
  };

  const defaultLocation = { pathname: 'what-you-need' };

  const renderPage = ({
    formData = {},
    location = defaultLocation,
    route = defaultRoute,
    router = { push: sandbox.spy() },
  } = {}) => {
    const store = createStore(formData);
    const utils = render(
      <Provider store={store}>
        <WhatYouNeed location={location} route={route} router={router} />
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
    const { container } = renderPage();

    await waitFor(() => {
      expect(bodyScrollStub.called).to.be.true;
    });

    const heading = container.querySelector('h2.vads-u-margin-bottom--2');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('What You Need to Get Started');

    const paragraph = container.querySelector('p.vads-u-margin-bottom--3');
    expect(paragraph).to.exist;
    expect(paragraph.textContent).to.include('Review this checklist');
  });

  it('displays the basic information summary box', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector('#basic-info-summary');
    expect(summaryBox).to.exist;
    expect(
      summaryBox.querySelector('h3[slot="headline"]').textContent,
    ).to.equal('Basic Information');
  });

  it('displays the disability information summary box', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector('#disability-info-summary');
    expect(summaryBox).to.exist;
    expect(
      summaryBox.querySelector('h3[slot="headline"]').textContent,
    ).to.equal('Disability Information');
  });

  it('displays the employment history summary box', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector('#employment-history-summary');
    expect(summaryBox).to.exist;
    expect(
      summaryBox.querySelector('h3[slot="headline"]').textContent,
    ).to.equal('Employment History');
  });

  it('displays the education and training summary box', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector('#education-training-summary');
    expect(summaryBox).to.exist;
    expect(
      summaryBox.querySelector('h3[slot="headline"]').textContent,
    ).to.equal('Education and Training');
  });

  it('displays the job search information summary box', () => {
    const { container } = renderPage();

    const summaryBox = container.querySelector('#job-search-summary');
    expect(summaryBox).to.exist;
    expect(
      summaryBox.querySelector('h3[slot="headline"]').textContent,
    ).to.equal('Job Search Information');
  });

  it('navigates back when back button is clicked', async () => {
    const { getByRole, router } = renderPage();
    const routerPush = router.push;

    const backButton = getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('important-information');
  });

  it('navigates forward when continue button is clicked', async () => {
    const { getByRole, router } = renderPage();
    const routerPush = router.push;

    const continueButton = getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal(
      'information-required-page',
    );
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

    const { getByRole } = renderPage({ formData });

    expect(
      getByRole('heading', {
        level: 2,
        name: 'What You Need to Get Started',
      }),
    ).to.exist;
  });

  it('renders all VaSummaryBox components', () => {
    const { container } = renderPage();

    expect(container.querySelector('#basic-info-summary')).to.exist;
    expect(container.querySelector('#disability-info-summary')).to.exist;
    expect(container.querySelector('#employment-history-summary')).to.exist;
    expect(container.querySelector('#education-training-summary')).to.exist;
    expect(container.querySelector('#job-search-summary')).to.exist;
  });

  it('renders navigation buttons', () => {
    const { getByRole } = renderPage();

    expect(getByRole('button', { name: /back/i })).to.exist;
    expect(getByRole('button', { name: /continue/i })).to.exist;
  });
});

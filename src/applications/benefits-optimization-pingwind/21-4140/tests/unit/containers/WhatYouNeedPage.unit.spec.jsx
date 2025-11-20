import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import WhatYouNeedPage from '../../../containers/WhatYouNeedPage';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('21-4140 container/WhatYouNeedPage', () => {
  let sandbox;
  let user;
  let hadScrollTo;
  let originalScrollTo;
  let bodyScrollStub;

  const defaultRoute = {
    pageList: [
      { path: 'introduction', pageKey: 'introduction' },
      { path: 'what-you-need', pageKey: 'whatYouNeed' },
      { path: 'section-one', pageKey: 'sectionOne' },
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
        <WhatYouNeedPage location={location} route={route} router={router} />
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

  it('renders page content, scrolls to top, and navigates correctly', async () => {
    const { getByRole, getByText, findByRole, router } = renderPage();
    const routerPush = router.push;

    await waitFor(() => {
      expect(bodyScrollStub.called).to.be.true;
    });

    expect(
      getByRole('heading', { level: 1, name: 'What You Need to Get Started' }),
    ).to.exist;
    expect(
      getByText(
        "Review this checklist for what you'll need. Don't have everything? You can start now and save your progress as you go.",
      ),
    ).to.exist;
    expect(getByRole('heading', { level: 2, name: 'Basic Information' })).to
      .exist;
    expect(getByRole('heading', { level: 2, name: 'Employment' })).to.exist;
    expect(getByText("Veteran's Name")).to.exist;
    expect(getByText('Date of Birth')).to.exist;
    expect(getByText('Social Security Number')).to.exist;
    expect(getByText('Veteran Service Number')).to.exist;
    expect(
      getByText(
        'Contact Information (mailing address, email address, phone number)',
      ),
    ).to.exist;
    expect(getByText('Employer names and addresses')).to.exist;
    expect(getByText('Work dates and hours per week')).to.exist;
    expect(getByText('Monthly earnings')).to.exist;
    expect(getByText('Time lost due to illness')).to.exist;

    const backButton = await findByRole('button', { name: /back/i });
    await user.click(backButton);
    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('introduction');

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);
    expect(routerPush.callCount).to.equal(2);
    expect(routerPush.secondCall?.args?.[0]).to.equal('section-one');
  });
});

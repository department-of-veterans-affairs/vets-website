import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import BeforeYouBeginPage from '../../../containers/BeforeYouBeginPage';

const createStore = (formData = {}) => ({
  getState: () => ({
    form: {
      data: formData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('21-4140 container/BeforeYouBeginPage', () => {
  let sandbox;
  let user;
  let hadScrollTo;
  let originalScrollTo;
  let bodyScrollStub;

  const defaultRoute = {
    pageList: [
      { path: 'introduction', pageKey: 'introduction' },
      { path: 'before-you-begin', pageKey: 'beforeYouBegin' },
      { path: 'what-you-need', pageKey: 'whatYouNeed' },
    ],
  };

  const defaultLocation = { pathname: 'before-you-begin' };

  const renderPage = ({
    formData = {},
    location = defaultLocation,
    route = defaultRoute,
    router = { push: sandbox.spy() },
  } = {}) => {
    const store = createStore(formData);
    const utils = render(
      <Provider store={store}>
        <BeforeYouBeginPage location={location} route={route} router={router} />
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

    expect(getByRole('heading', { level: 1, name: 'What to Expect' })).to.exist;
    expect(
      getByText(
        "We'll be asking you questions about your employment status for the last 12 months.",
      ),
    ).to.exist;
    expect(getByText('Keep in mind')).to.exist;
    expect(getByText('This form may take about 5 - 10 minutes to complete.')).to
      .exist;
    expect(getByText('You must answer all questions fully and accurately.')).to
      .exist;
    expect(
      getByText('You can save your progress and come back to this form later.'),
    ).to.exist;
    expect(
      getByText(
        'This form is for you to verify your employment status when asked, because you currently receive Individual Unemployability disability benefits for a service-connected condition.',
      ),
    ).to.exist;

    const backButton = await findByRole('button', { name: /back/i });
    await user.click(backButton);
    expect(routerPush.called).to.be.true;
    expect(routerPush.firstCall?.args?.[0]).to.equal('introduction');

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);
    expect(routerPush.callCount).to.equal(2);
    expect(routerPush.secondCall?.args?.[0]).to.equal('what-you-need');
  });

  it('renders skip to content link', () => {
    const { getByText } = renderPage();
    const skipLink = getByText('Skip to Content');

    expect(skipLink).to.exist;
    expect(skipLink.getAttribute('href')).to.equal('#main-content');
  });

  it('sets beforeYouBegin.visited when continuing forward', async () => {
    const initialFormData = {
      beforeYouBegin: {
        visited: false,
        extraField: 'keep-me',
      },
      anotherSection: {
        someValue: 42,
      },
    };

    const mockDispatch = sandbox.spy();
    const store = {
      getState: () => ({
        form: {
          data: initialFormData,
        },
      }),
      subscribe: () => {},
      dispatch: mockDispatch,
    };

    const router = { push: sandbox.spy() };
    const { findByRole } = render(
      <Provider store={store}>
        <BeforeYouBeginPage
          location={defaultLocation}
          route={defaultRoute}
          router={router}
        />
      </Provider>,
    );

    const continueButton = await findByRole('button', { name: /continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockDispatch.called).to.be.true;
    });

    const dispatchedAction = mockDispatch.firstCall?.args?.[0];
    expect(dispatchedAction?.type).to.equal('SET_DATA');
    expect(dispatchedAction?.data?.beforeYouBegin?.visited).to.be.true;
    expect(dispatchedAction?.data?.beforeYouBegin?.extraField).to.equal(
      'keep-me',
    );
    expect(dispatchedAction?.data?.anotherSection).to.deep.equal(
      initialFormData.anotherSection,
    );
    expect(initialFormData.beforeYouBegin.visited).to.be.false;
    expect(router.push.calledWith('what-you-need')).to.be.true;
  });
});

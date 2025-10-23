import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as ui from 'platform/utilities/ui';
import * as formTitleMod from 'platform/forms-system/src/js/components/FormTitle';
import { TITLE, SUBTITLE } from '../../../constants';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

sinon.stub(ui, 'scrollToTop').callsFake(() => {});
sinon.stub(ui, 'focusElement').callsFake(() => {});
sinon.stub(formTitleMod, 'default').callsFake(({ title, subTitle }) => (
  <h1 data-testid="form-title">
    {title} {subTitle}
  </h1>
));

const props = {
  route: {
    path: 'introduction',
    pageList: [
      { pageKey: 'introduction', path: '/introduction' },
      { pageKey: 'first', path: '/first' },
      { pageKey: 'review', path: '/review-and-submit' },
    ],
    formConfig,
  },
};

const makeStore = ({ loggedIn = false, loa = 3 } = {}) => ({
  getState: () => ({
    user: {
      login: { currentlyLoggedIn: loggedIn },
      profile: {
        loa: { current: loa },
        verified: loa === 3,
        savedForms: [],
        prefillsAvailable: [formConfig.formId],
        dob: '2000-01-01',
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: { metadata: {} },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('28-1900 IntroductionPage', () => {
  afterEach(() => cleanup());

  it('renders', () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('shows title and subtitle', () => {
    const store = makeStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const heading = getByTestId('form-title');
    expect(heading.textContent).to.include(TITLE);
    expect(heading.textContent).to.include(SUBTITLE);
  });

  it('shows SaveInProgress when a user is LOA3', () => {
    const store = makeStore({ loggedIn: true, loa: 3 });
    const { getByText } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText('Apply for veteran readiness and employment')).to.exist;
  });

  it('hides SaveInProgress when a user is logged in but not verified', () => {
    const store = makeStore({ loggedIn: true, loa: 1 });
    const { queryByText } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(queryByText('Apply for veteran readiness and employment')).to.be
      .null;
  });
});

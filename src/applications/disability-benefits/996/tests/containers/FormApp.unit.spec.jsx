import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import { Form0996App } from '../../containers/Form0996App';
import reducers from '../../reducers';
import { setHlrWizardStatus, removeHlrWizardStatus } from '../../wizard/utils';

const savedHlr = [
  {
    form: '20-0996',
    metadata: {
      expiresAt: moment()
        .add(1, 'day')
        .unix(),
    },
  },
];

const testPage = ({ savedForms = savedHlr, routerPushSpy = () => {} } = {}) => {
  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        savedForms,
      },
    },
    currentLocation: {
      pathname: '/introduction',
      search: '',
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
    },
  };
  const fakeStore = createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
    }),
    initialState,
  );
  return mount(
    <Provider store={fakeStore}>
      <Form0996App
        location={initialState.currentLocation}
        router={{ push: routerPushSpy }}
        savedForms={initialState.user.profile.savedForms}
      >
        <main>
          <h1>Intro</h1>
        </main>
      </Form0996App>
    </Provider>,
  );
};

describe('Form0996App', () => {
  it('should render', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const tree = testPage();
    const article = tree.find('#form-0996');

    expect(article).to.exist;
    expect(article.props()['data-location']).to.eq('introduction');
    expect(tree.find('h1').text()).to.eq('Intro');
    expect(tree.find('Connect(RoutedSavableApp)')).to.exist;
    expect(tree.find('LoadingIndicator')).to.have.lengthOf(0);

    tree.unmount();
  });

  it('should redirect to /start', () => {
    const routerPushSpy = sinon.spy();
    removeHlrWizardStatus();
    const tree = testPage({ savedForms: [], routerPushSpy });

    expect(tree.find('#form-0996')).to.have.lengthOf(0);
    expect(tree.find('h1').text()).to.contain('restart');
    expect(tree.find('LoadingIndicator')).to.have.lengthOf(1);
    expect(routerPushSpy.called).to.be.true;
    expect(routerPushSpy.args[0][0]).to.eq('/start');

    tree.unmount();
  });
});

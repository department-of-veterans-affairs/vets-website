import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { render, waitFor } from '@testing-library/react';
import CalculateYourBenefits from '../../containers/CalculateYourBenefits';
import {
  CALCULATED,
  CALCULATOR,
  CONSTANTS,
  ESTIMATED_BENEFITS,
  ELIGIBILITY,
  PROFILE,
} from '../data/calculate-benefits-data';

const getData = ({
  showNod = true,
  part3 = true,
  isLoading = false,
  loggedIn = true,
  formData = {},
  contestableIssues = { status: '' },
  returnUrl = '/veteran-details',
} = {}) => ({
  props: {
    loggedIn,
    showNod,
    location: { pathname: '/introduction', search: '' },
    children: <h1>Intro</h1>,
    // formData,
    router: { push: () => {} },
  },
  data: {
    profile: PROFILE,
    eligibility: ELIGIBILITY,
    estimatedBenefits: ESTIMATED_BENEFITS,
    calculator: CALCULATOR,
    calculated: CALCULATED,
    constants: CONSTANTS,
    featureToggles: {
      loading: isLoading,
      /* eslint-disable camelcase */
      form10182_nod: showNod,
      nod_part3_update: part3,
      /* eslint-enable camelcase */
    },
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: true,
      },
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {
          returnUrl,
        },
      },
      data: {
        ...formData,
      },
    },
    contestableIssues,
  },
});

describe('<CalculateYourBenefits>', () => {
  const oldWindow = global.window;

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', async () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = undefined;
    const isOJT = false;
    const { props, data } = getData();
    const store = mockStore(data);
    render(
      <Provider store={mockStore(data)}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          {...props}
        />
      </Provider>,
    );
    await waitFor(() => {
      const action = store.getActions();
      expect(action.length).to.eq(0);
    });
  });
  it('should render and handle scroll events', () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);

    const gibctEybBottomSheet = true;
    const isOJT = false;
    const { props, data } = getData();
    const store = mockStore(data);

    const addEventListenerSpy = sinon.spy(global.window, 'addEventListener');
    const removeEventListenerSpy = sinon.spy(
      global.window,
      'removeEventListener',
    );

    const wrapper = mount(
      <Provider store={store}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          {...props}
        />
      </Provider>,
    );

    global.window.dispatchEvent(new Event('scroll'));
    expect(addEventListenerSpy.calledWith('scroll', sinon.match.func)).to.be
      .true;
    const element = wrapper.find('div#eyb-summary-sheet').getDOMNode();
    expect(document.body.contains(element)).to.be.false;
    wrapper.unmount();
    expect(removeEventListenerSpy.calledWith('scroll', sinon.match.func)).to.be
      .true;

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });
  it('should return no ', () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = true;
    const isOJT = false;
    const { props, data } = getData();
    const store = mockStore(data);
    const tree = mount(
      <Provider store={store}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          {...props}
        />
      </Provider>,
    );
    expect(
      tree
        .find('div.vads-u-padding-bottom--1.small-screen-font')
        .at(1)
        .text()
        .includes('No'),
    ).to.be.true;
    tree.unmount();
  });
  it('should', () => {
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    const gibctEybBottomSheet = true;
    const isOJT = false;
    const { props, data } = getData();
    const newData = {
      ...data,
      profile: {
        ...data.profile,
        attributes: {
          ...data.profile.attributes,
          vetWebsiteLink: '',
          section103Message: '',
          yr: '',
          vrrap: 'vrrap',
        },
      },
    };
    const store = mockStore(newData);
    const tree = mount(
      <Provider store={store}>
        <CalculateYourBenefits
          gibctEybBottomSheet={gibctEybBottomSheet}
          isOJT={isOJT}
          {...props}
        />
      </Provider>,
    );
    const div = tree
      .find('div.vads-u-padding-bottom--1.small-screen-font')
      .at(0);
    expect(div.text().includes('No')).to.be.true;
    const div2 = tree
      .find('div.vads-u-padding-bottom--1.small-screen-font')
      .at(1);
    expect(div2.text().includes('No')).to.be.true;
    const div3 = tree
      .find('div.vads-u-padding-bottom--1.small-screen-font')
      .at(2);
    expect(div3.text().includes('No')).to.be.true;
    const div4 = tree
      .find('div.vads-u-padding-bottom--1.small-screen-font')
      .at(3);
    expect(div4.text().includes('Yes')).to.be.true;
    tree.unmount();
  });
});

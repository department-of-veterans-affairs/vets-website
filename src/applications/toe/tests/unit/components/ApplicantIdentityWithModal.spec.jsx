import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import { ApplicantIdentityWithModal } from '../../../components/ApplicantIdentityWithModal';
import NoSponsorModal from '../../../components/NoSponsorModal';
import ApplicantIdentityView from '../../../components/ApplicantIdentityView';

describe('ApplicantIdentityWithModal Component', () => {
  const mockStore = configureStore();
  const initialState = {
    user: {
      profile: {
        userFullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        },
        dob: '1990-01-01',
      },
    },
    featureToggles: {
      [featureFlagNames.showMeb54901990eTextUpdate]: true,
    },
    data: {
      fetchedSponsorsComplete: true,
      sponsors: { sponsors: [] },
    },
  };
  it('renders modal when flag is on, sponsors fetched, and none exist', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ApplicantIdentityWithModal
          fetchedSponsorsComplete
          showTextUpdate
          sponsors={{ sponsors: [] }}
        />
      </Provider>,
    );
    expect(wrapper.find(NoSponsorModal)).to.have.lengthOf(1);
    expect(wrapper.find(ApplicantIdentityView)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('does not render modal when feature flag is off', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ApplicantIdentityWithModal
          fetchedSponsorsComplete
          showTextUpdate={false}
          sponsors={{ sponsors: [] }}
        />
      </Provider>,
    );
    expect(wrapper.find(NoSponsorModal)).to.have.lengthOf(0);
    expect(wrapper.find(ApplicantIdentityView)).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('does not render modal while sponsors are loading', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ApplicantIdentityWithModal
          fetchedSponsorsComplete={false}
          showTextUpdate
          sponsors={{ sponsors: [] }}
        />
      </Provider>,
    );
    expect(wrapper.find(NoSponsorModal)).to.have.lengthOf(0);
    expect(wrapper.find(ApplicantIdentityView)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});

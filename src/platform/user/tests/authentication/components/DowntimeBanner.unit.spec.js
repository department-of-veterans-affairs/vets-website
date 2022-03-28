import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DowntimeBanners, {
  downtimeBannersConfig,
  DowntimeBanner,
} from 'platform/user/authentication/components/DowntimeBanner';

const mockStore = configureMockStore();
const generateState = ({
  ssoeDown = false,
  idmeDown = false,
  dslogonDown = false,
  mhvDown = false,
  mviDown = false,
  logingovDown = false,
}) => ({
  externalServiceStatuses: {
    statuses: [
      {
        service: 'DS Logon',
        serviceId: 'dslogon',
        status: dslogonDown ? 'inactive' : 'active',
      },
      {
        service: 'ID.me',
        serviceId: 'idme',
        status: idmeDown ? 'inactive' : 'active',
      },
      {
        service: 'SSOe',
        serviceId: 'ssoe',
        status: ssoeDown ? 'inactive' : 'active',
      },
      {
        service: 'Login.gov',
        serviceId: 'logingov',
        status: logingovDown ? 'inactive' : 'active',
      },
      {
        service: 'MVI',
        serviceId: 'mvi',
        status: mviDown ? 'inactive' : 'active',
      },
      {
        service: 'MHV',
        serviceId: 'mhv',
        status: mhvDown ? 'inactive' : 'active',
      },
    ],
  },
});
const filteredDowntimeConfig = deps => {
  return downtimeBannersConfig.reduce((dependency, current) => {
    return current.dependencies.includes(deps) ? current : dependency;
  }, {});
};

describe('DowntimeBanners', () => {
  it('should render a collection of `DowntimeBanner`', () => {
    const initialState = generateState({});
    const store = mockStore(initialState);
    const wrapper = shallow(<DowntimeBanners store={store} />);

    expect(wrapper.find('DowntimeBanner').length).to.eql(5);
    wrapper.unmount();
  });
});

describe('DowntimeBanner', () => {
  const downtimeDeps = ['ssoe', 'mhv', 'idme', 'logingov', 'dslogon', 'mhv'];
  let initialState;
  let downtimeBannerProps;
  let store;

  beforeEach(() => {
    initialState = generateState({});
    store = mockStore(initialState);
    downtimeBannerProps = filteredDowntimeConfig();
  });

  downtimeDeps.forEach(dependency => {
    it(`should render if ${dependency} is down`, () => {
      initialState = generateState({ [`${dependency}Down`]: true });
      store = mockStore(initialState);
      downtimeBannerProps = filteredDowntimeConfig(dependency);

      const wrapper = shallow(
        <DowntimeBanner store={store} {...downtimeBannerProps} />,
      );

      expect(wrapper.find('h2').text()).to.eql(downtimeBannerProps.headline);
      expect(wrapper.find('va-alert').prop('visible')).to.be.true;
      expect(wrapper.find('va-alert').prop('status')).to.eql(
        downtimeBannerProps.status,
      );
      wrapper.unmount();
    });
  });
});

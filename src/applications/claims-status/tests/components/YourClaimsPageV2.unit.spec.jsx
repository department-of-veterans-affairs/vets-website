import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import cloneDeep from '~/platform/utilities/data/cloneDeep';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { YourClaimsPageV2 } from '../../containers/YourClaimsPageV2';

import { claimsAvailability } from '../../utils/appeals-v2-helpers';
import { renderWithRouter } from '../utils';

const mockStore = createStore(() => ({}));

const localStorageMock = (() => {
  let store = createStore(() => ({}));

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

describe('<YourClaimsPageV2>', () => {
  const defaultProps = {
    canAccessClaims: true,
    canAccessAppeals: true,
    claimsLoading: false,
    appealsLoading: false,
    stemClaimsLoading: false,
    loading: false,
    appealsAvailable: claimsAvailability.AVAILABLE,
    claimsAvailable: claimsAvailability.AVAILABLE,
    claimsAuthorized: true,
    list: [
      {
        type: 'claimSeries',
        id: '1122334455',
        attributes: {
          dateField: '2022-01-01',
          decisionLetterSent: true,
          phase: null,
        },
      },
      {
        id: '9043',
        type: 'education_benefits_claims',
        attributes: {
          confirmationNumber: 'V-EBC-9043',
          isEnrolledStem: true,
          isPursuingTeachingCert: null,
          benefitLeft: 'moreThanSixMonths',
          remainingEntitlement: null,
          automatedDenial: true,
          deniedAt: '2022-01-31T15:08:20.489Z',
          submittedAt: '2022-01-31T15:08:20.489Z',
        },
      },
      {
        type: 'legacyAppeal',
        id: '1122334454',
        attributes: {
          updated: '2018-05-29T19:38:40-04:00',
          events: [{ date: '2018-06-01' }],
          issues: [],
          status: {
            details: {},
          },
        },
      },
    ],
    pages: 1,
    page: 1,
    getClaims: sinon.spy(),
    getAppealsV2: sinon.spy(),
    getStemClaims: sinon.spy(),
    location: {
      pathname: '/claims',
      search: '?page=1',
    },
    history: {
      push: sinon.spy(),
    },
  };

  it('should render', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.type()).to.equal(React.Fragment);
    wrapper.unmount();
  });

  it('should render <ClaimsAppealsUnavailable/>', () => {
    const { container } = renderWithRouter(
      <Provider store={mockStore}>
        <YourClaimsPageV2
          {...defaultProps}
          appealsAvailable={claimsAvailability.UNAVAILABLE}
          claimsAvailable={claimsAvailability.UNAVAILABLE}
        />
      </Provider>,
    );

    expect($('.claims-unavailable', container)).to.exist;
  });

  it('should render a loading indicator if all requests loading', () => {
    const props = cloneDeep(defaultProps);
    props.appealsLoading = true;
    props.claimsLoading = true;
    props.stemClaimsLoading = true;
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a loading indicator if one list empty and other loading', () => {
    const props = cloneDeep(defaultProps);
    props.stemClaimsLoading = true;
    props.list = [];
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a list of claims and appeals', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.find('AppealListItem').length).to.equal(1);
    expect(wrapper.find('ClaimsListItem').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render Pagination', () => {
    const props = {
      ...defaultProps,
      list: new Array(12).fill(defaultProps.list[0]),
    };
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.text()).to.include('Showing 1 \u2012 10 of 12 events');
    // web component isn't rendering? But page info does...
    // expect(wrapper.find('va-pagination').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a no claims message when no claims or appeals present', () => {
    const props = cloneDeep(defaultProps);
    props.list = [];
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('NoClaims').length).to.equal(1);
    wrapper.unmount();
  });

  it('should not render error messages if appeals are loading', () => {
    const props = set('appealsLoading', true, defaultProps);
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('ClaimsAppealsUnavailable').length).to.equal(0);
    expect(wrapper.find('ClaimsUnavailable').length).to.equal(0);
    expect(wrapper.find('AppealsUnavailable').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render error messages if claims are loading', () => {
    const props = set('claimsLoading', true, defaultProps);
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('ClaimsAppealsUnavailable').length).to.equal(0);
    expect(wrapper.find('ClaimsUnavailable').length).to.equal(0);
    expect(wrapper.find('AppealsUnavailable').length).to.equal(0);
    wrapper.unmount();
  });

  it('should not render claims and appeals unavailable when neither is unavailable', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.find('ClaimsAppealsUnavailable').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render claims unavailable when claims are unavailable', () => {
    const props = set('claimsAvailable', false, defaultProps);
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('ClaimsUnavailable').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render appeals unavailable when appeals are unavailable', () => {
    const props = set('appealsAvailable', false, defaultProps);
    const wrapper = shallow(<YourClaimsPageV2 {...props} />);
    expect(wrapper.find('AppealsUnavailable').length).to.equal(1);
    wrapper.unmount();
  });

  it('should include combined claims additional info', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.find('#claims-combined').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a FeaturesWarning component', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.find('FeaturesWarning').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a NeedHelp warning component', () => {
    const wrapper = shallow(<YourClaimsPageV2 {...defaultProps} />);
    expect(wrapper.find('NeedHelp').length).to.equal(1);
    wrapper.unmount();
  });

  it('should return updated state when page changes in getDerivedStateFromProps', () => {
    const nextProps = {
      location: {
        pathname: '/claims',
        search: '?page=2',
      },
    };
    const prevState = { page: 1 };

    const newState = YourClaimsPageV2.getDerivedStateFromProps(
      nextProps,
      prevState,
    );
    expect(newState).to.deep.equal({ page: 2 });
  });

  it('should return null when page does not change in getDerivedStateFromProps', () => {
    const nextProps = {
      location: {
        pathname: '/claims',
        search: '?page=1',
      },
    };
    const prevState = { page: 1 };

    const newState = YourClaimsPageV2.getDerivedStateFromProps(
      nextProps,
      prevState,
    );
    expect(newState).to.be.null;
  });

  it('should return the correct page from getPageFromURL', () => {
    const testProps = {
      location: {
        search: '?page=3',
      },
    };

    const page = YourClaimsPageV2.getPageFromURL(testProps);
    expect(page).to.equal(3);
  });

  it('should return 1 when page is not provided in getPageFromURL', () => {
    const testProps = {
      location: {
        search: '',
      },
    };

    const page = YourClaimsPageV2.getPageFromURL(testProps);
    expect(page).to.equal(1);
  });
});

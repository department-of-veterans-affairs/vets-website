import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  IntroductionPage,
  WIZARD_STATUS_COMPLETE,
} from '../../../1990/containers/IntroductionPage';

describe('Edu 1990 <IntroductionPage>', () => {
  const mockStore = {
    sessionStorage: {},
  };

  let sessionStorage;
  let defaultProps;

  before(() => {
    global.sessionStorage = {
      getItem: key =>
        key in mockStore.sessionStorage ? mockStore.sessionStorage[key] : null,
      setItem: (key, value) => {
        mockStore.sessionStorage[key] = `${value}`;
      },
      removeItem: key => delete mockStore.sessionStorage[key],
      clear: () => {
        mockStore.sessionStorage = {};
      },
    };
  });

  beforeEach(() => {
    defaultProps = {
      route: {
        formConfig: {},
      },
      saveInProgress: {
        user: {
          login: {},
          profile: {
            services: [],
          },
        },
      },
    };
  });

  afterEach(() => {
    global.sessionStorage.clear();
  });

  it('should show the wizard on initial render with no education-benefits sessionStorage keys', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(mockStore.sessionStorage).to.be.empty;
    wrapper.unmount();
  });
  it('should display the wizard options when the button is clicked', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.exists('#wizardOptions')).to.equal(true);
    wrapper.unmount();
  });
  it('should display the subway map when the wizard is completed', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      wizardCompletionStatus: WIZARD_STATUS_COMPLETE,
    });
    expect(wrapper.exists('.subway-map')).to.equal(true);
    expect(wrapper.exists('.wizard-container')).to.equal(false);
    wrapper.unmount();
  });
});

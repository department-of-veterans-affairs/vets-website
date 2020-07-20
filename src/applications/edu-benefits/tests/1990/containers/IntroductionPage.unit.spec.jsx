import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from '../../../1990/containers/IntroductionPage';

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
  it('should display the wizard when the button is clicked', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.exists('#wizardOptions')).to.equal(true);
    wrapper.unmount();
  });
  it('should display the subway map when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '1990',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(true);
    expect(wrapper.exists('.wizard-container')).to.equal(false);
    wrapper.unmount();
  });
  it('should display the 0994 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '0994',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('0994');
    wrapper.unmount();
  });
  it('should display the 1995 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '1995',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('1995');
    wrapper.unmount();
  });
  it('should display the 5495 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '5495',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('5495');
    wrapper.unmount();
  });
  it('should display the 5490 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '5490',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('5490');
    wrapper.unmount();
  });
  it('should display the 1990E button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '1990E',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('1990E');
    wrapper.unmount();
  });
  it('should display the 1990N button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '1990N',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('1990N');
    wrapper.unmount();
  });
  it('should display the 10203 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitSelected: '10203',
      wizardCompletionStatus: 'complete',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('10203');
    wrapper.unmount();
  });
});

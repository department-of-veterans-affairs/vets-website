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
  it('should display the 1990 subway map when the correct radio button selections are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitReferred: '1990',
      wizardCompletionStatus: 'awaiting click on apply button',
    });
    const applyNowLink = wrapper.find('#apply-now-link');
    expect(applyNowLink.prop('href')).to.include('1990');
    applyNowLink.simulate('click', { preventDefault: () => {} });
    expect(wrapper.exists('.subway-map')).to.equal(true);
    expect(wrapper.exists('.wizard-container')).to.equal(false);
    wrapper.unmount();
  });
  it('should display the 0994 button when the correct radio button selection are made', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    instance.setState({
      educationBenefitReferred: '0994',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '1995',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '5495',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '5490',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '1990E',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '1990N',
      wizardCompletionStatus: 'awaiting click on apply button',
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
      educationBenefitReferred: '10203',
      wizardCompletionStatus: 'awaiting click on apply button',
    });
    expect(wrapper.exists('.subway-map')).to.equal(false);
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.find('#apply-now-link').prop('href')).to.include('10203');
    wrapper.unmount();
  });
});

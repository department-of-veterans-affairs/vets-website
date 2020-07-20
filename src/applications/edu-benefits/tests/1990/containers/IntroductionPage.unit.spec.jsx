import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { IntroductionPage } from '../../../1990/containers/IntroductionPage';
import { wrap } from 'lodash';

describe('Edu 1990 <IntroductionPage>', () => {
  const mockStore = {
    getState: () =>
      []
        .concat([
          ['newBenefit'],
          ['serviceBenefitBasedOn', 'transferredEduBenefits'],
          ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
          ['vetTecBenefit'],
          ['sponsorTransferredBenefits'],
          ['applyForScholarship'],
        ])
        .reduce((state, field) => Object.assign(state, { [field]: null }), {
          open: false,
          educationBenefitSelected: 'none selected',
          wizardCompletionStatus: 'not complete',
        }),
    subscribe: () => {},
    dispatch: () => {},
    sessionStorage: {},
  };

  let state;
  let sessionStorage;
  let sessionStorageGetItemSpy;
  let sessionStorageSetItemSpy;

  const getQuestion = (wrapper, name) => wrapper.find(name);

  const answerQuestion = (wrapper, name, value) =>
    getQuestion(wrapper, name).simulate('change', { target: { value } });

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
    state = mockStore.getState();
  });

  it('should show the wizard on initial render with no education-benefits sessionStorage keys', () => {
    const wrapper = mount(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        saveInProgress={{
          user: {
            login: {},
            profile: {
              services: [],
            },
          },
        }}
      />,
    );
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    expect(wrapper.exists('.subway-map')).to.equal(false);
    // expect(mockStore.sessionStorage).to.be.empty;
    // expect(wrapper.find('FormTitle').props().title).to.contain('Apply for');
    // expect(wrapper.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
    //   .true;
    // expect(wrapper.find('.process-step').length).to.equal(4);
    wrapper.unmount();
  });
  it('should display the wizard when the button is clicked', () => {
    const wrapper = mount(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        saveInProgress={{
          user: {
            login: {},
            profile: {
              services: [],
            },
          },
        }}
      />,
    );
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.exists('#wizardOptions')).to.equal(true);
    wrapper.unmount();
  });
  it('should display the subway map when the correct radio button selection are made', () => {
    const wrapper = mount(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        saveInProgress={{
          user: {
            login: {},
            profile: {
              services: [],
            },
          },
        }}
      />,
    );

    // const newBenefitWrapper = wrapper.find('#newBenefit');
    // const instance = newBenefitWrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    const instance = wrapper.instance();
    // console.log(instance);
    wrapper
      .find('#newBenefit-0')
      .simulate('change', { target: { value: 'yes' } });
    wrapper
      .find('#serviceBenefitBasedOn-0')
      .simulate('change', { target: { value: 'own' } });
    wrapper
      .find('#nationalCallToService-1')
      .simulate('change', { target: { value: 'no' } });
    // console.log(wrapper.debug(), wrapper.state());
    // wrapper
    //   .find('#vetTecBenefit-1')
    //   .simulate('change', { target: { value: 'no' } });
    // instance.setState({
    //   educationBenefitSelected: '1990',
    //   wizardCompletionStatus: 'complete',
    // });
    // instance.answerQuestion('newBenefit', 'yes');
    // instance.answerQuestion('serviceBenefitBasedOn', 'own');
    // instance.answerQuestion('nationalCallToService', 'no');
    // instance.answerQuestion('vetTecBenefit', 'no');

    // answerQuestion(wrapper, '#newBenefit-0', 'yes');
    // answerQuestion(wrapper, '#serviceBenefitBasedOn-0', 'own');
    // answerQuestion(wrapper, '#nationalCallToService-1', 'no');
    // answerQuestion(wrapper, '#vetTecBenefit-1', 'no');

    // const newBenefitRadioButtons = wrapper.find('#newBenefit');

    // instance.setState({
    //   newBenefit: 'yes',
    //   educationBenefitSelected: 'pending',
    // });
    // console.log(wrapper.state());
    // const serviceBenefitRadioButtons = wrapper.find('#serviceBenefitBasedOn');
    // serviceBenefitRadioButtons.invoke('onValueChange')('own');
    // wrapper.setState({
    //   serviceBenefitBasedOn: 'own',
    // });
    // const nationalServiceRadioButtons = wrapper.find('#nationalCallToService');
    // nationalServiceRadioButtons.invoke('onValueChange')('no');
    // wrapper.setState({
    //   nationalCallToService: 'no',
    // });
    // const vecTecRadioButtons = wrapper.find('#vetTecBenefit');
    // vecTecRadioButtons.invoke('onValueChange')('no');
    // wrapper.setState({
    //   vetTecBenefit: 'no',
    // });
    // wrapper.update();
    // console.log(wrapper.debug());
    wrapper.unmount();
  });
});

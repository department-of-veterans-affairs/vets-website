import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { generateWizardAnswers } from '../utilities';

describe('generateWizardAnswers', () => {
  it('returns appropriate defaults when `signinoptions` and `idoptions` are empty', () => {
    const wizardOptions = generateWizardAnswers({});

    expect(wizardOptions).to.eql({
      showNextQuestion: false,
      shouldShowAnswer: false,
      Answer: null,
    });
  });

  it('returns same defaults when `signinoptions` do not match', () => {
    const wizardOptions = generateWizardAnswers({ signinoptions: 'hello' });

    expect(wizardOptions).to.eql({
      showNextQuestion: false,
      shouldShowAnswer: false,
      Answer: null,
    });
  });

  it('returns a truthy `shouldShowAnswer` and an `Answer` JSX component when `signinoptions` is "logingov" or "idme"', () => {
    const wizardOptions = generateWizardAnswers({ signinoptions: 'logingov' });

    expect(wizardOptions).to.eql({
      showNextQuestion: false,
      shouldShowAnswer: true,
      Answer: wizardOptions.Answer,
    });
  });

  it('returns a truthy `showNextQuestion` when `signinoptions` is "none"', () => {
    const wizardOptions = generateWizardAnswers({
      signinoptions: 'none',
    });

    expect(wizardOptions).to.eql({
      showNextQuestion: true,
      shouldShowAnswer: false,
      Answer: null,
    });
  });

  it('suggests Login.gov when `signinoptions`: "none" and `idoptions`: "state"', () => {
    const wizardOptions = generateWizardAnswers({
      signinoptions: 'none',
      idoptions: 'state',
    });

    const { Answer } = wizardOptions;

    expect(wizardOptions).to.eql({
      showNextQuestion: true,
      shouldShowAnswer: true,
      Answer,
    });

    const wrapper = shallow(<Answer />);
    const pTag = wrapper.find('strong');
    expect(pTag.text()).to.include('Login.gov');
    wrapper.unmount();
  });

  it('suggests Login.gov when `signinoptions`: "none" and `idoptions`: "state"', () => {
    const wizardOptions = generateWizardAnswers({
      signinoptions: 'none',
      idoptions: 'other',
    });

    const { Answer } = wizardOptions;

    expect(wizardOptions).to.eql({
      showNextQuestion: true,
      shouldShowAnswer: true,
      Answer,
    });

    const wrapper = shallow(<Answer />);
    const pTag = wrapper.find('strong');
    expect(pTag.text()).to.not.include('Login.gov');
    wrapper.unmount();
  });
});

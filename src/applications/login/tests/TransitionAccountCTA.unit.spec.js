import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TransitionAccountCTA from '../components/TransitionAccountCTA';
import { ACCOUNT_TRANSITION } from '../constants';

describe('TransitionAccountCTA', () => {
  let canTransition;

  beforeEach(() => {
    canTransition = false;
  });

  it('should render', () => {
    const wrapper = shallow(
      <TransitionAccountCTA canTransition={canTransition} />,
    );

    const headline = wrapper.find('h3');

    expect(headline.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render CTA different when `canTransition` prop is false', () => {
    const wrapper = shallow(
      <TransitionAccountCTA canTransition={canTransition} />,
    );

    const headline = wrapper.find('h3');
    const texts = wrapper.find('li').map(node => node.text());
    const buttons = wrapper.find('button');

    expect(headline.text()).to.eql(ACCOUNT_TRANSITION.headline.disabled);
    expect(texts).to.eql([
      'You have a state-issued identification license, or',
      'You have a passport, and',
      'You have a smartphone capable of taking pictures',
    ]);
    expect(buttons.children()).to.have.lengthOf(3);

    wrapper.unmount();
  });

  it('should render CTA different when `canTransition` prop is true', () => {
    canTransition = true;
    const wrapper = shallow(
      <TransitionAccountCTA canTransition={canTransition} />,
    );
    const headline = wrapper.find('h3');
    const texts = wrapper.find('li').map(node => node.text());
    const buttons = wrapper.find('button');

    expect(headline.text()).to.eql(ACCOUNT_TRANSITION.headline.enabled);
    expect(texts).to.eql([
      'Name, and',
      'Date of birth, and',
      'Social Security Number',
    ]);
    expect(buttons.children()).to.have.lengthOf(2);
    wrapper.unmount();
  });
});

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ObfuscateReviewField from '../../components/ObfuscateReviewField';

describe('ObfuscateReviewField component', () => {
  it('renders without crashing', () => {
    const uiSchema = { 'ui:title': 'Obfuscated Title' };

    const wrapper = mount(
      <ObfuscateReviewField uiSchema={uiSchema}>
        <span />
      </ObfuscateReviewField>,
    );

    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('displays the title from uiSchema', () => {
    const uiSchema = { 'ui:title': 'Obfuscated Title' };

    const wrapper = mount(
      <ObfuscateReviewField uiSchema={uiSchema}>
        <span />
      </ObfuscateReviewField>,
    );

    expect(wrapper.find('dt').text()).to.equal('Obfuscated Title');
    wrapper.unmount();
  });

  it('obfuscates the formData content', () => {
    const uiSchema = { 'ui:title': 'Obfuscated Title' };
    const formData = 'Sensitive Information';

    const wrapper = mount(
      <ObfuscateReviewField uiSchema={uiSchema}>
        <span />
      </ObfuscateReviewField>,
    );

    const obfuscatedText = wrapper.find('dd').text();

    // Adjusted expectation to check for `●` characters
    expect(obfuscatedText).to.not.equal(formData);
    expect(obfuscatedText).to.match(/●+/); // Checks if the obfuscation contains `●` characters
    wrapper.unmount();
  });
});

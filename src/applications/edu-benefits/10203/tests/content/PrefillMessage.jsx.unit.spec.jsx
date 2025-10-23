import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PrefillMessage from '../../content/PrefillMessage';

describe('PrefillMessage', () => {
  it('renders null when form is not prefilled', () => {
    const wrapper = shallow(
      <PrefillMessage formContext={{ prefilled: false }} />,
    );
    expect(wrapper.isEmptyRender()).to.equal(true);
    wrapper.unmount();
  });

  it('renders the message when form is prefilled', () => {
    const wrapper = shallow(
      <PrefillMessage formContext={{ prefilled: true }} />,
    );
    expect(wrapper.hasClass('usa-alert-info')).to.equal(true);
    expect(wrapper.text()).to.equal(
      "We've prefilled this application with information from your account. If you need to correct anything, you can edit the form fields.",
    );
    wrapper.unmount();
  });

  it('renders custom children when provided', () => {
    const customMessage = 'Custom prefill message';
    const wrapper = shallow(
      <PrefillMessage formContext={{ prefilled: true }}>
        {customMessage}
      </PrefillMessage>,
    );
    expect(wrapper.text()).to.equal(customMessage);
    wrapper.unmount();
  });
});

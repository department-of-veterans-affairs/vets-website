// Node modules.
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
// Relative imports.
import { App } from '.';

describe('Ask VA <App>', () => {
  it('renders ask va link with correct href and text', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('a[href="/contact-us/ask-va"]')).to.have.lengthOf(1);
    expect(wrapper.find('a[href="/contact-us/ask-va"]').text()).to.equal(
      'Contact us online through Ask VA',
    );
    expect(wrapper.find('a[rel="noreferrer noopener"]')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});

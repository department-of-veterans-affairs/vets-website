// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Promo Banners <App>', () => {
  it('renders promo banner', () => {
    // Set up.
    const wrapper = shallow(<App />);

    // Assertions.
    expect(wrapper.find('PromoBanner')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });
});

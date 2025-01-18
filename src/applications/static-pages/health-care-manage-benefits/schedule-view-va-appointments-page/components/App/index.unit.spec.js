// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CallToActionWidget from 'applications/static-pages/cta-widget';
// Relative imports.
import { App } from './index';

describe('Appointments Page <App>', () => {
  it('renders the CallToActionWidget', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(CallToActionWidget)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});

// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { LogoRow } from '.';

describe('Header <LogoRow>', () => {
  it('renders content', () => {
    const wrapper = shallow(<LogoRow />);
    expect(wrapper.text()).includes('Sign in');
    expect(wrapper.text()).includes('Menu');
    wrapper.unmount();
  });
});

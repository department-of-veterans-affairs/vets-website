// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { LegacyHeader } from '.';

describe('Header <LegacyHeader>', () => {
  it('renders content', () => {
    const wrapper = shallow(<LegacyHeader />);
    expect(wrapper.find(`LegacyHeader`)).be.have.lengthOf(1);
    wrapper.unmount();
  });
});

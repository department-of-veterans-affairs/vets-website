// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import UnauthContent from '.';

describe('Get Medical Records Page <UnauthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<UnauthContent />);

    const text = wrapper.text();
    expect(text).to.include('VA Blue Button');
    expect(text).to.include('What you can do when you sign in');
    expect(text).to.include('Who can manage VA medical records online');
    expect(text).to.include('Questions about managing your VA medical records');

    wrapper.unmount();
  });
});

// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '.';

describe('Get Medical Records Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);

    const text = wrapper.text();
    expect(text).to.include(
      'What are My HealtheVet and My VA Health, and which will I use?',
    );
    expect(text).to.include(
      'What you can do in My HealtheVet’s VA Blue Button',
    );
    expect(text).to.include('What you can do in My VA Health’s Health Records');
    expect(text).to.include('Who can manage VA medical records online');
    expect(text).to.include('Questions about managing your VA medical records');

    wrapper.unmount();
  });
});

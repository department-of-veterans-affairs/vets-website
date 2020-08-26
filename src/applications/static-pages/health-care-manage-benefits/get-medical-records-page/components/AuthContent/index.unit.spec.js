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
    expect(text).to.include('CernerCallToAction');
    expect(text).to.include('My HealtheVet (VA Blue Button) and My VA Health');
    expect(text).to.include('My HealtheVet (VA Blue Button) and My VA Health');
    expect(text).to.include(
      'What are My HealtheVet and My VA Health, and which will I use?',
    );
    expect(text).to.include(
      'How can My HealtheVet’s VA Blue Button tool help me manage my care?',
    );
    expect(text).to.include(
      'How can My VA Health’s Health Records tool help me manage my care?',
    );
    expect(text).to.include('Am I eligible to use these tools?');
    expect(text).to.include(
      'Once I’m signed in, how do I access my medical records?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');
    expect(text).to.include(
      "What's VHIE, and how can it help me manage my health?",
    );
    expect(text).to.include('How do I opt out?');
    expect(text).to.include('If I opt out, how can I opt back in?');
    expect(text).to.include('Can I check my sharing preference status?');

    wrapper.unmount();
  });
});

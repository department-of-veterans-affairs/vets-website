// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import UnauthContent from '.';

describe('Secure Messaging Page <UnauthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<UnauthContent />);

    const text = wrapper.text();
    expect(text).to.include(
      'How can VA Secure Messaging help me manage my health care?',
    );
    expect(text).to.include('Am I eligible to use Secure Messaging?');
    expect(text).to.include(
      'How does Secure Messaging work within My HealtheVet?',
    );
    expect(text).to.include(
      'Can I use Secure Messaging for medical emergencies or urgent needs?',
    );
    expect(text).to.include(
      'Can I use Secure Messaging to communicate with non-VA providers?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});

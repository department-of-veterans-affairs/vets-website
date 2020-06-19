// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from './index';

describe('Schedule View VA Appointments Page <App>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<App />);

    const text = wrapper.text();
    expect(text).to.include('View, schedule, or cancel a VA appointment');
    expect(text).to.include(
      'How can VA appointment tools help me manage my health care?',
    );
    expect(text).to.include('Am I eligible to use the VA appointment tools?');
    expect(text).to.include(
      'How do I know if my VA health facility uses online scheduling?',
    );
    expect(text).to.include(
      'What types of medical appointments can I schedule online?',
    );
    expect(text).to.include(
      'Can I use this tool to schedule non-VA appointments?',
    );
    expect(text).to.include(
      'Can I schedule appointments through VA Secure Messaging?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});

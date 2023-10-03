// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { UnauthContent } from '.';

describe('Scheduling Page <UnauthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<UnauthContent />);

    const text = wrapper.text();
    expect(text).to.include(
      'How can the VA appointments tool help me manage my care?',
    );
    expect(text).to.include('Am I eligible to use this tool?');
    expect(text).to.include(
      'How do I know if my VA health facility uses online scheduling?',
    );
    expect(text).to.include(
      'What types of VA health appointments can I schedule online?',
    );
    expect(text).to.include(
      'Can I use this tool to schedule community (non-VA) appointments?',
    );
    expect(text).to.include(
      'Can I schedule appointments through VA secure messaging?',
    );
    expect(text).to.include(
      'Will my personal health information be protected?',
    );
    expect(text).to.include('What if I have more questions?');

    wrapper.unmount();
  });
});

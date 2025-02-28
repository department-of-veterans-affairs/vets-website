// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '.';

describe('View Test + Lab Results Page <AuthContent>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<AuthContent />);
    const text = wrapper.text();
    expect(text).to.include(
      'What are My HealtheVet and My VA Health, and which will I use?',
    );
    expect(text).to.include(
      'If you receive care at Mann-Grandstaff VA Medical Center',
    );
    expect(text).to.include(
      'If you receive care at any other VA medical center',
    );
    expect(text).to.include('If you’re viewing results on My HealtheVet');
    expect(text).to.include('If you’re viewing results on My VA Health');
    expect(text).to.include('For My HealtheVet questions');
    expect(text).to.include('For My VA Health questions');

    wrapper.unmount();
  });
});

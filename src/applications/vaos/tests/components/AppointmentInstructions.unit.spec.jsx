import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AppointmentInstructions from '../../components/AppointmentInstructions';

describe('VAOS <AppointmentInstructions>', () => {
  it('should return instructions', () => {
    const tree = shallow(
      <AppointmentInstructions instructions="Follow-up/Routine: Testing" />,
    );
    expect(tree.text()).to.contain('Follow-up/Routine');
    expect(tree.text()).to.contain('Testing');

    tree.unmount();
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarRadioOption from '../../../components/calendar/CalendarRadioOption';

describe('VAOS <CalendarRadioOption>', () => {
  it('should render a radio button with proper label and values', () => {
    const tree = shallow(
      <CalendarRadioOption
        index={0}
        fieldName="test"
        value="2010-10-08"
        checked
        label="8"
      />,
    );
    const radioButton = tree.find('input#radio-0');
    const label = tree.find('label');
    expect(radioButton.length).to.equal(1);
    expect(radioButton.props().checked).to.equal(true);
    expect(radioButton.props().value).to.equal('2010-10-08');
    expect(label.text()).to.equal('8');
    tree.unmount();
  });
});

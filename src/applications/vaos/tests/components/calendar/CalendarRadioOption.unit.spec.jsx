import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarRadioOption from '../../../components/calendar/CalendarRadioOption';

describe('VAOS <CalendarRadioOption>', () => {
  it('should render a radio button with proper label and values', () => {
    const tree = shallow(
      <CalendarRadioOption
        id="0"
        fieldName="test"
        value="2019-10-24T10:00:00-07:00"
        checked
        label="10:00 a.m."
      />,
    );
    const radioButton = tree.find('input#radio-0');
    const label = tree.find('label span').at(0);
    const srLabel = tree.find('label span').at(1);
    expect(radioButton.length).to.equal(1);
    expect(radioButton.props().checked).to.equal(true);
    expect(radioButton.props().value).to.equal('2019-10-24T10:00:00-07:00');
    expect(label.text()).to.equal('10:00 a.m.');
    expect(srLabel.text()).to.equal('10:00 a.m. option selected');
    tree.unmount();
  });
});

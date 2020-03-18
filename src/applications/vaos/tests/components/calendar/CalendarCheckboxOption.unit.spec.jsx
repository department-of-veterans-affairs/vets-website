import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalendarCheckboxOption from '../../../components/calendar/CalendarCheckboxOption';

describe('VAOS <CalendarCheckboxOption>', () => {
  it('should render a checkbox with proper label and values', () => {
    const tree = shallow(
      <CalendarCheckboxOption
        id="0"
        fieldName="test"
        value="AM"
        checked
        label="a.m."
      />,
    );
    const checkbox = tree.find('input#checkbox-0');
    const label = tree.find('label span').at(0);
    const srLabel = tree.find('label span').at(1);
    expect(checkbox.length).to.equal(1);
    expect(checkbox.props().checked).to.equal(true);
    expect(checkbox.props().value).to.equal('AM');
    expect(label.text()).to.equal('a.m.');
    expect(srLabel.text()).to.equal('a.m. appointment');
    tree.unmount();
  });
});

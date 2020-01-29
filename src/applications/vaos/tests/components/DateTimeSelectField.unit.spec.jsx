import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DateTimeSelectField from '../../components/DateTimeSelectField';

describe('<DateTimeSelectField>', () => {
  it('should generate time option labels', () => {
    const formContext = {
      availableSlots: [
        {
          date: '2019-01-02',
          datetime: '2019-01-02T05:00:00',
        },
      ],
    };
    const formData = {};
    const tree = shallow(
      <DateTimeSelectField formData={formData} formContext={formContext} />,
    );

    const options = tree
      .find('CalendarWidget')
      .props()
      .additionalOptions.getOptionsByDate('2019-01-02');

    const TestFunction = () => options[0].label;
    const label = shallow(<TestFunction />);

    expect(label.text()).to.contain('5:00 a.m. AM');

    tree.unmount();
  });
});

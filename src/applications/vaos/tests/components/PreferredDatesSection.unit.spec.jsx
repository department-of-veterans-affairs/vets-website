import React from 'react';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PreferredDatesSection from '../../components/review/PreferredDatesSection';

const data = {
  calendarData: {
    selectedDates: [
      {
        date: '2019-11-25',
        optionTime: 'AM',
      },
      {
        date: '2019-11-26',
        optionTime: 'AM',
      },
      {
        date: '2019-11-27',
        optionTime: 'AM',
      },
    ],
  },
};

describe('VAOS <PreferredDatesSection>', () => {
  let tree;

  beforeEach(() => {
    tree = shallow(<PreferredDatesSection data={data} />);
  });

  afterEach(() => {
    tree.unmount();
  });

  it('should render heading', () => {
    expect(tree.find('h3').text()).to.equal('Preferred date and time');
  });

  it('should have aria labels for edit preferred date', () => {
    expect(
      tree.find(Link).find('[aria-label="Edit preferred date"]'),
    ).to.have.lengthOf(1);
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CautionaryInformation from '../../../components/profile/CautionaryInformation';

describe('<CautionaryInformation>', () => {
  it('should render', () => {
    const institution = {
      complaints: {
        financialByFacCode: 0,
      },
      cautionFlags: [],
    };
    const tree = shallow(<CautionaryInformation institution={institution} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('renders a bold description if description is "Total Complaints"', () => {
    const props = {
      institution: {
        complaints: {
          mainCampusRollUp: 0,
          'Total Complaints': 5,
        },
        cautionFlags: ['some caution flag'],
      },
      showModal: () => {},
    };

    const wrapper = shallow(<CautionaryInformation {...props} />);
    const totalComplaintsRow = wrapper.find('span').filterWhere(item => {
      return item.containsMatchingElement(<strong>Total Complaints</strong>);
    });

    expect(totalComplaintsRow.exists()).to.be.false;
    wrapper.unmount();
  });
});

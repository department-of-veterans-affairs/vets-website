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
});

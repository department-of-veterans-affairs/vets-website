import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CautionFlagAdditionalInfo from '../../components/CautionFlagAdditionalInfo';

describe('<CautionFlagAdditionalInfo>', () => {
  it('should render', () => {
    const tree = shallow(<CautionFlagAdditionalInfo />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should render flags', () => {
    const tree = shallow(
      <CautionFlagAdditionalInfo cautionFlags={[{ title: 'TEST' }]} expanded />,
    );
    expect(tree.find('.headingFlag').length).to.eq(1);
    tree.unmount();
  });
});

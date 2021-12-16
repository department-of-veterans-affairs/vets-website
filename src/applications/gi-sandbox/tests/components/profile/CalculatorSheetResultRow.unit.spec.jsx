import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalculatorSheetResultRow from '../../../components/profile/CalculatorSheetResultRow';

describe('<CalculatorSheetResultRow>', () => {
  it('should render', () => {
    const tree = shallow(<CalculatorSheetResultRow visible />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should not render when invisible', () => {
    const tree = shallow(<CalculatorSheetResultRow />);
    expect(tree.type()).to.equal(null);
    tree.unmount();
  });
});

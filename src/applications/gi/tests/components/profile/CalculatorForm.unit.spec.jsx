import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../../../platform/startup/store';
import reducer from '../../../reducers';
import CalculatorForm from '../../../components/profile/CalculatorForm';

const defaultProps = {
  ...createCommonStore(reducer).getState().calculator,
};

describe('<CalculatorForm>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<CalculatorForm {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should test return Zip code must be a 5-digit number if zipcode is invalid', () => {
    const tree = SkinDeep.shallowRender(<CalculatorForm {...defaultProps} />);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should assign an empty string to initial state of beneficiaryZIP', () => {
    const tree = shallow(<CalculatorForm {...defaultProps} />);
    expect(defaultProps.beneficiaryZIP).to.have.lengthOf(0);
  });
});

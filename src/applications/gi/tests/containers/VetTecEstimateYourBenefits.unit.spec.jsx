import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import createCommonStore from 'platform/startup/store';
import { VetTecEstimateYourBenefits } from '../../containers/VetTecEstimateYourBenefits';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  beneficiaryZIPCodeChanged: sinon.spy(),
  calculatorInputChange: sinon.spy(),
  calculated: {},
};

describe('<VetTecEstimateYourBenefits>', () => {
  it('should render', () => {
    const tree = shallow(<VetTecEstimateYourBenefits {...defaultProps} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});

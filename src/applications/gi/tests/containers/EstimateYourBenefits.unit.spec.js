import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import createCommonStore from 'platform/startup/store';
import { EstimateYourBenefits } from '../../containers/EstimateYourBenefits';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  calculatorInputChange: sinon.spy(),
  beneficiaryZIPCodeChanged: sinon.spy(),
  showModal: sinon.spy(),
  hideModal: sinon.spy(),
  eligibilityChange: sinon.spy(),
  updateEstimatedBenefits: sinon.spy(),
  calculated: {},
};

describe('<EstimateYourBenefits>', () => {
  it('should render', () => {
    const tree = shallow(<EstimateYourBenefits {...defaultProps} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import * as Utilities from '../../utilities';
import CustomReviewField from '../../ReviewPage/CustomReviewField';

describe('CustomReviewField Component', () => {
  let useSelectorStub;
  let calculatedPercentageStub;

  beforeEach(() => {
    useSelectorStub = sinon.stub(ReactRedux, 'useSelector');
    calculatedPercentageStub = sinon.stub(Utilities, 'calculatedPercentage');
  });

  afterEach(() => {
    useSelectorStub.restore();
    calculatedPercentageStub.restore();
  });

  it('should render the correct <dt> text', () => {
    useSelectorStub.returns({});
    calculatedPercentageStub.returns('Mocked Percentage');
    const wrapper = shallow(<CustomReviewField />);
    expect(wrapper.find('dt').text()).to.equal(
      'VA beneficiary students percentage (calculated)',
    );
    wrapper.unmount();
  });

  it('should call calculatedPercentage with form data from Redux', () => {
    const mockFormData = { students: 10 };
    useSelectorStub.returns(mockFormData);
    calculatedPercentageStub.returns('Some result');
    const wrapper = shallow(<CustomReviewField />);
    expect(calculatedPercentageStub.calledOnce).to.be.true;
    expect(calculatedPercentageStub.calledWithExactly(mockFormData)).to.be.true;
    wrapper.unmount();
  });

  it('should display the calculated percentage in the <dd>', () => {
    useSelectorStub.returns({});
    calculatedPercentageStub.returns('75%');

    const wrapper = shallow(<CustomReviewField />);
    const ddElement = wrapper.find('dd.dd-privacy-hidden');
    expect(ddElement.text()).to.equal('75%');
    wrapper.unmount();
  });
  it('should handle missing state.form?.data by defaulting to empty object', () => {
    useSelectorStub.returns(undefined);

    calculatedPercentageStub.returns('No data');

    const wrapper = shallow(<CustomReviewField />);
    expect(calculatedPercentageStub.calledOnce).to.be.true;
    expect(calculatedPercentageStub.calledWithExactly({})).to.be.false;

    const ddElement = wrapper.find('dd.dd-privacy-hidden');
    expect(ddElement.text()).to.equal('No data');
    wrapper.unmount();
  });
});

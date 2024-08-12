import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';
import BenefitsForm from '../../../components/profile/BenefitsForm';
import reducer from '../../../reducers';
import Dropdown from '../../../components/Dropdown';

const commonStore = createCommonStore(reducer);
const defaultProps = {
  ...commonStore.getState().eligibility,
  showModal: () => {},
};

const checkExpectedDropdowns = (tree, expected) => {
  expected.forEach(dropdown => {
    expect(tree.find(`#${dropdown}-dropdown`)).to.not.be.undefined;
  });
};

describe('<BenefitsForm>', () => {
  const preEligibilityChangeMock = value => {
    function createMockFunction() {
      const mock = function(...args) {
        mock.calls.push(args);
      };
      mock.calls = [];
      return mock;
    }
    const mockEligibilityChangeRedux = createMockFunction();
    const eligibilityChangeMock = sinon.stub();
    const wrapper = shallow(
      <BenefitsForm
        eligibilityChangeRedux={mockEligibilityChangeRedux}
        eligibilityChange={eligibilityChangeMock}
      />,
    );
    wrapper
      .find(Dropdown)
      .first()
      .props()
      .onChange({
        target: { name: 'giBillChapter', value },
      });
    return {
      wrapper,
      mockEligibilityChangeRedux,
    };
  };

  it('should render', () => {
    const tree = mount(<BenefitsForm {...defaultProps} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should render default fields', () => {
    const tree = mount(<BenefitsForm {...defaultProps} />);

    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'giBillChapter',
      'cumulativeService',
    ]);
    tree.unmount();
  });

  it('should render spouse active duty field', () => {
    const props = {
      ...defaultProps,
      giBillChapter: '33b',
      militaryStatus: 'spouse',
    };
    const tree = mount(<BenefitsForm {...props} />);
    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'spouseActiveDuty',
      'giBillChapter',
      'cumulativeService',
    ]);
    tree.unmount();
  });

  it('should render fields for Montgomery GI Bill (Ch 30)', () => {
    const props = { ...defaultProps, giBillChapter: '30' };
    const tree = mount(<BenefitsForm {...props} />);
    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'giBillChapter',
      'enlistmentService',
    ]);
    tree.unmount();
  });

  it('should render fields for VR&E (Ch 31)', () => {
    const props = { ...defaultProps, giBillChapter: '31' };
    const tree = mount(
      <Provider store={commonStore}>
        <BenefitsForm {...props} />
      </Provider>,
    );
    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'giBillChapter',
      'eligForPostGiBill',
      'numberOfDependents',
    ]);
    tree.unmount();
  });

  it('should render fields for VR&E (Ch 31) when eligible for Post-9/11 GI Bill', () => {
    const props = {
      ...defaultProps,
      giBillChapter: '31',
      eligForPostGiBill: 'yes',
    };
    const tree = mount(
      <Provider store={commonStore}>
        <BenefitsForm {...props} />
      </Provider>,
    );
    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'giBillChapter',
      'eligForPostGiBill',
    ]);
    tree.unmount();
  });
  it('sets the appropriate military status for 33a option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '33a',
    );

    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      { militaryStatus: 'veteran' },
    ]);
    wrapper.unmount();
  });
  it('sets the appropriate military status for 33b option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '33b',
    );
    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      { militaryStatus: 'spouse' },
    ]);

    wrapper.unmount();
  });
  it('sets the appropriate military status for 30 option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '30',
    );

    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      { militaryStatus: 'veteran' },
    ]);

    wrapper.unmount();
  });
  it('sets the appropriate military status for 1606 option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '1606',
    );

    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      { militaryStatus: 'national guard / reserves' },
    ]);

    wrapper.unmount();
  });
  it('sets the appropriate military status for 31 option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '31',
    );

    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      { militaryStatus: 'veteran' },
    ]);

    wrapper.unmount();
  });
  it('sets the appropriate military status for 35 option', () => {
    const { wrapper, mockEligibilityChangeRedux } = preEligibilityChangeMock(
      '35',
    );
    expect(mockEligibilityChangeRedux.calls).to.have.lengthOf(1);
    expect(mockEligibilityChangeRedux.calls[0]).to.deep.equal([
      {
        militaryStatus: 'spouse',
      },
    ]);
    wrapper.unmount();
  });

  it('should render info Post Bill when military status active duty ', () => {
    const props = { ...defaultProps, militaryStatus: 'active duty' };
    const tree = mount(<BenefitsForm {...props} />);
    const div = tree.find('div.military-status-info.warning.form-group');
    expect(div.text()).to.equal(
      'Post 9/11 GI Bill recipients serving on Active Duty (or transferee spouses of a service member on active duty) are not eligible to receive a monthly housing allowance.',
    );
    tree.unmount();
  });

  it('should render header when showHeader is true', () => {
    const props = { ...defaultProps, showHeader: true };
    const tree = mount(<BenefitsForm {...props} />);
    const header = tree.find('#benefits-header');
    expect(header.text()).to.equal('Your benefits');
    tree.unmount();
  });
});

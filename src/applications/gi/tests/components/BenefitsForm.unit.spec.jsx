import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import createCommonStore from 'platform/startup/store';
import { BenefitsForm } from '../../components/profile/BenefitsForm';
import reducer from '../../reducers';
import { Provider } from 'react-redux';

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
    const props = { ...defaultProps, militaryStatus: 'spouse' };
    const tree = mount(<BenefitsForm {...props} />);
    checkExpectedDropdowns(tree, [
      'militaryStatus',
      'spouseActiveDuty',
      'giBillChapter',
      'cumulativeService',
    ]);
    tree.unmount();
  });

  it('should render fields for Post-9/11 GI Bill (Ch 33)', () => {
    const props = { ...defaultProps, giBillChapter: '33' };
    const tree = mount(<BenefitsForm {...props} />);
    checkExpectedDropdowns(tree, [
      'militaryStatus',
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
});

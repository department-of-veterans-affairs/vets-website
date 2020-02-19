import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import StemEligibilityView from '../../../1995/containers/StemEligibilityView';
import createCommonStore from '../../../../../platform/startup/store';
import { Provider } from 'react-redux';

const defaultStore = createCommonStore();
const defaultProps = {
  ...defaultStore.getState(),
  formData: {
    determineEligibility: {
      __errors: [],
    },
  },
};
describe('<StemEligibilityView>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should have isEdithNourseRogersScholarshipCheck with checkmark', () => {
    const store = {
      ...defaultStore,
      state: {
        ...defaultProps,
        form: {
          data: {
            benefit: 'chapter33',
            isEdithNourseRogersScholarship: true,
          },
        },
      },
    };
    const tree = mount(
      <Provider store={store}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    // console.log(
    //   tree
    //     .find('li')
    //     .at(0)
    //     .html(),
    // );
    expect(
      tree
        .find('li')
        .at(0)
        .find('i')
        .hasClass('fa-check'),
    ).to.equal(true);
    expect(
      tree
        .find('li')
        .at(0)
        .find('i')
        .hasClass('vads-u-color--green'),
    ).to.equal(true);
    tree.unmount();
  });
  it('should have isEdithNourseRogersScholarshipCheck with X', () => {});
  it('should have isEdithNourseRogersScholarshipCheck with question', () => {});
  it('should have exhaustionOfBenefitsCheck with checkmark', () => {});
  it('should have exhaustionOfBenefitsCheck with X', () => {});
  it('should have isEnrolledStemCheck with checkmark', () => {});
  it('should have isEnrolledStemCheck with X', () => {});
  it('should display ExploreOtherBenefits and ContinueApplication', () => {});
});

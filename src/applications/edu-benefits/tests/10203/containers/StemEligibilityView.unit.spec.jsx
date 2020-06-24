import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import StemEligibilityView from '../../../10203/containers/StemEligibilityView';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';

const createStore = (data = {}) =>
  createCommonStore({
    form: () => ({
      data: {
        benefit: 'chapter33',
        isEdithNourseRogersScholarship: true,
        'view:exhaustionOfBenefits': true,
        'view:exhaustionOfBenefitsAfterPursuingTeachingCert': true,
        isEnrolledStem: true,
        isPursuingTeachingCert: true,
        ...data,
      },
    }),
  });
const defaultStore = createStore();
const defaultProps = {
  ...defaultStore.getState(),
  formData: {},
  errorSchema: {
    'view:determineEligibility': {
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
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(0)
      .find('i');
    expect(icon.hasClass('fa-check')).to.equal(true);
    expect(icon.hasClass('vads-u-color--green')).to.equal(true);

    tree.unmount();
  });
  it('should have isEdithNourseRogersScholarshipCheck with X', () => {
    const store = createStore({
      benefit: 'chapter0',
    });
    const tree = mount(
      <Provider store={store}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(0)
      .find('i');
    expect(icon.hasClass('fa-times')).to.equal(true);
    expect(icon.hasClass('vads-u-color--gray-medium')).to.equal(true);

    tree.unmount();
  });
  it('should have isEdithNourseRogersScholarshipCheck with question', () => {
    const store = createStore({
      benefit: undefined,
    });
    const tree = mount(
      <Provider store={store}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(0)
      .find('i');
    expect(icon.hasClass('fa-question')).to.equal(true);
    expect(icon.hasClass('vads-u-color--gray-medium')).to.equal(true);

    tree.unmount();
  });
  it('should have exhaustionOfBenefitsCheck with checkmark', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(1)
      .find('i');
    expect(icon.hasClass('fa-check')).to.equal(true);
    expect(icon.hasClass('vads-u-color--green')).to.equal(true);
    tree.unmount();
  });
  it('should have exhaustionOfBenefitsCheck with X', () => {
    const store = createStore({
      'view:exhaustionOfBenefits': false,
      'view:exhaustionOfBenefitsAfterPursuingTeachingCert': false,
    });
    const tree = mount(
      <Provider store={store}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(1)
      .find('i');
    expect(icon.hasClass('fa-times')).to.equal(true);
    expect(icon.hasClass('vads-u-color--gray-medium')).to.equal(true);
    tree.unmount();
  });
  it('should have isEnrolledStemCheck with checkmark', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(2)
      .find('i');
    expect(icon.hasClass('fa-check')).to.equal(true);
    expect(icon.hasClass('vads-u-color--green')).to.equal(true);

    tree.unmount();
  });
  it('should have isEnrolledStemCheck with X', () => {
    const store = createStore({
      isEnrolledStem: false,
      isPursuingTeachingCert: false,
    });
    const tree = mount(
      <Provider store={store}>
        <StemEligibilityView {...defaultProps} />
      </Provider>,
    );
    const icon = tree
      .find('li')
      .at(2)
      .find('i');
    expect(icon.hasClass('fa-times')).to.equal(true);
    expect(icon.hasClass('vads-u-color--gray-medium')).to.equal(true);
    tree.unmount();
  });
  it('should display ExploreOtherBenefits and ContinueApplication', () => {
    const props = {
      ...defaultProps,
      formData: {
        'view:determineEligibility': false,
      },
    };
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...props} />
      </Provider>,
    );
    expect(tree.find('a').text()).to.equal('Explore other education benefits');

    tree.unmount();
  });
  it('should not display ExploreOtherBenefits and ContinueApplication', () => {
    const props = {
      ...defaultProps,
      formData: {
        'view:determineEligibility': true,
      },
    };
    const tree = mount(
      <Provider store={defaultStore}>
        <StemEligibilityView {...props} />
      </Provider>,
    );
    expect(tree.find('a')).to.have.lengthOf(0);

    tree.unmount();
  });
});

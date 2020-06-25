import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ConfirmEligibilityView from '../../containers/ConfirmEligibilityView';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';

const createStore = (data = {}) =>
  createCommonStore({
    form: () => ({
      data: {
        'view:benefit': { chapter33: true },
        isEnrolledStem: true,
        isPursuingTeachingCert: false,
        benefitLeft: 'none',
        ...data,
      },
    }),
  });
const defaultStore = createStore();
const defaultProps = {
  ...defaultStore.getState(),
  formData: {},
  errorSchema: {
    'view:confirmEligibility': {
      __errors: [],
    },
  },
};

describe('<ConfirmEligibilityView>', () => {
  it('should render', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display checkmark for correct benefit', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
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

  it('should display X for incorrect benefit', () => {
    const store = createStore({
      'view:benefit': { chapter30: true },
    });
    const props = {
      ...defaultProps,
      ...store.getState(),
    };
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...props} />
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

  it('should display checkmark for correct isEnrolledStem', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
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

  it('should display checkmark for correct isPursuingTeachingCert', () => {
    const store = createStore({
      isEnrolledStem: false,
      isPursuingTeachingCert: true,
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
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

  it('should display X for invalid enrollment', () => {
    const store = createStore({
      isEnrolledStem: false,
      isPursuingTeachingCert: false,
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
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

  it('should display checkmark for correct benefitLeft', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
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

  it('should display X for incorrect benefitLeft', () => {
    const store = createStore({
      benefitLeft: 'moreThanSixMonths',
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
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
});

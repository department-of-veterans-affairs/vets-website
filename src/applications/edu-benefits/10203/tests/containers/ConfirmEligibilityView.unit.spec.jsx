import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';
import ConfirmEligibilityView from '../../containers/ConfirmEligibilityView';

const createStore = (data = {}) =>
  createCommonStore({
    form: () => ({
      data: {
        'view:benefit': { chapter33: true },
        isEnrolledStem: true,
        'view:teachingCertClinicalTraining': {
          isPursuingTeachingCert: false,
          isPursuingClinicalTraining: false,
        },
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

  it('should render ExitApplicationButton', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree.find('ExitApplicationButton')).to.not.be.undefined;
    tree.unmount();
  });

  it('should display checkmark for correct benefit', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(0)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--green')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display X for incorrect benefit', () => {
    const store = createStore({ 'view:benefit': { chapter30: true } });
    const props = { ...defaultProps, ...store.getState() };
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...props} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(0)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--gray-medium')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display checkmark for correct isEnrolledStem', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(1)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--green')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display checkmark for correct isPursuingTeachingCert', () => {
    const store = createStore({
      'view:teachingCertClinicalTraining': {
        isPursuingTeachingCert: true,
        isPursuingClinicalTraining: false,
      },
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(1)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--green')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display X for invalid enrollment', () => {
    const store = createStore({
      isEnrolledStem: false,
      'view:teachingCertClinicalTraining': {
        isPursuingTeachingCert: false,
        isPursuingClinicalTraining: false,
      },
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(1)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--gray-medium')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display checkmark for correct benefitLeft', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(5)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--green')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display X for incorrect benefitLeft', () => {
    const store = createStore({ benefitLeft: 'moreThanSixMonths' });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    const iconLi = tree
      .find('li')
      .at(5)
      .find('span.icon-li');
    expect(iconLi).to.not.be.undefined;
    expect(iconLi.hasClass('vads-u-color--gray-medium')).to.equal(true);
    const icon = iconLi.find('va-icon');
    expect(icon).to.not.be.undefined;

    tree.unmount();
  });

  it('should display invalid remaining entitlement', () => {
    const store = createStore({
      'view:remainingEntitlement': {
        months: 6,
        days: 1,
        totalDays: 181,
      },
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );
    expect(tree.html()).to.contain('6 months');

    tree.unmount();
  });

  it('should not display valid remaining entitlement', () => {
    const store = createStore({
      'view:remainingEntitlement': {
        months: 1,
        days: 1,
        totalDays: 31,
      },
    });
    const tree = mount(
      <Provider store={store}>
        <ConfirmEligibilityView {...defaultProps} />
      </Provider>,
    );

    expect(tree.html()).to.not.contain('1 months, 1 days');

    tree.unmount();
  });
});

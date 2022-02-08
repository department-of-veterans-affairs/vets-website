import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import EstimateYourBenefitsSummarySheet from '../../components/EstimateYourBenefitsSummarySheet';

const outputs = {
  giBillPaysToSchool: { visible: true, value: '$8,970/yr' },
  tuitionAndFeesCharged: { visible: true, value: '$8,970' },
  yourScholarships: { visible: false, value: '$0' },
  outOfPocketTuition: { visible: true, value: '$0' },
  housingAllowance: { visible: true, value: '$1,521/mo' },
  bookStipend: { visible: true, value: '$1,000/yr' },
  totalPaidToYou: { visible: true, value: '$14,689' },
  perTerm: {
    yellowRibbon: {
      visible: false,
      title: 'Yellow Ribbon',
      terms: [{ label: 'Total per year', value: '$0', visible: true }],
    },
    housingAllowance: {
      visible: true,
      title: 'Housing allowance',
      learnMoreAriaLabel:
        'Learn more about how we calculate your housing allowance',
      terms: [
        { label: 'Months 1-6', value: '$1,143/mo', visible: true },
        { label: 'Months 7-12', value: '$914/mo', visible: true },
        { label: 'Months 13-18', value: '$686/mo', visible: true },
        { label: 'Months 19-24', value: '$457/mo', visible: true },
      ],
    },
  },
};

describe('<EstimateYourBenefitsSummarySheet>', () => {
  it('should render expanded for IHL', () => {
    const tree = mount(
      <EstimateYourBenefitsSummarySheet
        outputs={outputs}
        expandEybSheet
        toggleEybExpansion={() => sinon.spy()}
        type={'PUBLIC'}
        yellowRibbon
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should render collapsed for IHL', () => {
    const tree = mount(
      <EstimateYourBenefitsSummarySheet
        outputs={outputs}
        expandEybSheet={false}
        toggleEybExpansion={() => sinon.spy()}
        type={'PUBLIC'}
        yellowRibbon
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should render expanded for OJT', () => {
    const tree = mount(
      <EstimateYourBenefitsSummarySheet
        outputs={outputs}
        expandEybSheet
        toggleEybExpansion={() => sinon.spy()}
        type={'OJT'}
        yellowRibbon
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
  it('should render collapsed for OJT', () => {
    const tree = mount(
      <EstimateYourBenefitsSummarySheet
        outputs={outputs}
        expandEybSheet={false}
        toggleEybExpansion={() => sinon.spy()}
        type={'OJT'}
        yellowRibbon
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });
});

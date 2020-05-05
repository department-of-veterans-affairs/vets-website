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
  },
};

describe('<EstimateYourBenefitsSummarySheet>', () => {
  it('should render', () => {
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
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';
import DetailsAlert from '../../combined/components/DetailsAlert';
import i18nCombinedDebtPortal from '../../i18n';

describe('DetailsAlert', () => {
  const mockDebt = {
    adamKey: '4',
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '44',
    diaryCode: '680',
    benefitType: 'CH35 EDU',
    amountOverpaid: 16000.0,
    amountWithheld: 0.0,
    originalAr: '13000',
    currentAr: '10000',
    debtHistory: [
      {
        date: '09/18/2012',
        letterCode: '100',
        status: 'First Demand Letter - Inactive Benefits',
        description:
          'First due process letter sent when debtor is not actively receiving any benefits.',
      },
    ],
    compositeDebtId: '441300',
  };

  const renderWithI18n = component => {
    return render(
      <I18nextProvider i18n={i18nCombinedDebtPortal}>
        {component}
      </I18nextProvider>,
    );
  };

  it('renders debt details alert correctly', () => {
    const wrapper = renderWithI18n(
      <DetailsAlert type="debt" data={mockDebt} />,
    );

    expect(wrapper.getByTestId('details-alert-441300')).to.exist;
    expect(wrapper.getByTestId('details-alert-441300')).to.have.attribute(
      'status',
    );

    // Check that header is rendered
    expect(wrapper.getByRole('heading')).to.exist;

    // Check that body text is rendered
    expect(wrapper.container.querySelector('p')).to.exist;

    wrapper.unmount();
  });
});

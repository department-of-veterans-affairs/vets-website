import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';
import SummaryCard from '../../combined/components/SummaryCard';
import i18nCombinedDebtPortal from '../../i18n';

describe('SummaryCard', () => {
  const mockDebt = {
    fileNumber: '000000009',
    payeeNumber: '00',
    personEntitled: 'STUB_M',
    deductionCode: '21',
    diaryCode: '608',
    diaryCodeDescription: 'Full C&P Benefit Offset Notification',
    benefitType: 'CH33 Housing EDU',
    amountOverpaid: 0.0,
    amountWithheld: 94.34,
    originalAr: 321.76,
    currentAr: 227.42,
    debtHistory: [
      {
        date: '03/05/2004',
        letterCode: '608',
        description: 'Full C&P Benefit Offset Notification.',
      },
    ],
    compositeDebtId: '2111599',
  };

  const renderWithI18n = component => {
    return render(
      <I18nextProvider i18n={i18nCombinedDebtPortal}>
        {component}
      </I18nextProvider>,
    );
  };

  it('renders debt summary card correctly', () => {
    const wrapper = renderWithI18n(<SummaryCard type="debt" data={mockDebt} />);

    // Check that card is rendered with correct test ID
    expect(wrapper.getByTestId('summary-card-2111599')).to.exist;

    // Check header
    expect(wrapper.getByRole('heading')).to.exist;

    // Check amount is displayed
    expect(wrapper.getByText('Current balance:')).to.exist;
    expect(wrapper.getByText('$227.42')).to.exist;

    wrapper.unmount();
  });

  it('renders icon, message, link', () => {
    const wrapper = renderWithI18n(<SummaryCard type="debt" data={mockDebt} />);

    // Check for icon
    expect(wrapper.container.querySelector('va-icon[icon="info"]')).to.exist;

    // Check for message
    expect(wrapper.container.querySelector('p')).to.exist;

    // Check for link
    expect(wrapper.getByTestId('link-details')).to.exist;
    expect(wrapper.getByTestId('link-details')).to.have.attribute(
      'href',
      '/debt-balances/2111599',
    );
    expect(wrapper.getByTestId('link-details')).to.have.attribute(
      'text',
      'Review details',
    );

    wrapper.unmount();
  });
});

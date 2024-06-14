import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  convertDateFormat,
  formatPhoneNumber,
  bytesToKB,
  MilitaryHistory,
  WorkHistory,
  FinancialDisclosure,
  AdditionalInformation,
} from '../../../components/SectionField';

describe('convertDateFormat', () => {
  it('correctly converts YYYY-MM-DD to MM/DD/YYYY', () => {
    const inputDate = '2023-10-19';
    const expectedDate = '10/19/2023';
    const result = convertDateFormat(inputDate);
    expect(result).to.equal(expectedDate);
  });

  it('returns undefined for null or undefined input', () => {
    expect(convertDateFormat(null)).to.eql('');
    expect(convertDateFormat()).to.eql('');
  });
});

describe('formatPhoneNumber', () => {
  it('correctly converts YYYY-MM-DD to MM/DD/YYYY', () => {
    const inputDate = '5555555555';
    const expectedDate = '(555) 555-5555';
    const result = formatPhoneNumber(inputDate);
    expect(result).to.equal(expectedDate);
  });

  it('returns undefined for null or undefined input', () => {
    expect(formatPhoneNumber(null)).to.eql('');
    expect(formatPhoneNumber()).to.eql('');
  });
});

describe('bytesToKB', () => {
  it('correctly converts bytes to KB', () => {
    const inputBytes = 2048;
    const expectedKB = '2 KB';
    const result = bytesToKB(inputBytes);
    expect(result).to.equal(expectedKB);
  });
});

describe('<Military History />', () => {
  const formData = {
    previousNames: [
      {
        first: 'John',
        middle: 'C',
        last: 'Doe',
        suffix: 'Jr.',
      },
    ],
    placeOfSeparation: 'California',
    nationalGuardActivation: true,
    'view:powStatus': [],
    severancePay: null,
  };

  it('it renders previous names', () => {
    const { queryByText } = render(<MilitaryHistory formData={formData} />);
    expect(queryByText('John')).to.not.be.null;
  });

  it('it renders empty previous names', () => {
    const badPreviousNames = {
      previousNames: [{ first: '', middle: '', last: '' }],
    };
    const { queryByText } = render(
      <MilitaryHistory formData={badPreviousNames} />,
    );
    expect(queryByText('None')).to.not.be.null;
  });
});

describe('<WorkHistory />', () => {
  it('renders with disabilities', () => {
    const formData = {
      'view:hasVisitedVaMc': true,
      'view:workedBeforeDisabled': true,
      'view:history': {
        jobs: [
          {
            name: 'test-job',
            jobTitle: 'test-title',
            address: {
              street: '1234 Random street',
              street2: 'Apt 2',
              city: 'Nopesville',
              state: 'VA',
              postalCode: '12345',
              country: 'USA',
            },
            daysMissed: '2',
            annualEarnings: 60000,
            dateRange: {
              from: '10121999',
              to: '10302000',
            },
          },
        ],
      },
      disabilities: [{ name: 'test-disability' }],
    };
    const { queryByText } = render(<WorkHistory formData={formData} />);
    expect(queryByText('test-disability')).to.not.be.null;
  });

  it('renders with disabilities', () => {
    const formData = {
      'view:hasVisitedVaMc': false,
      'view:workedBeforeDisabled': false,
      'view:history': { jobs: [] },
      disabilities: [],
    };
    const { queryByText } = render(<WorkHistory formData={formData} />);
    expect(queryByText('test-disability')).to.be.null;
  });
});

describe('FinancialDisclosure', () => {
  it('should show other expenses', () => {
    const formData = {
      otherExpenses: [
        { paidTo: 'frank', purpose: 'mileage', amount: 92, date: '10/12/1999' },
      ],
    };

    const { queryByText } = render(<FinancialDisclosure formData={formData} />);

    expect(queryByText('frank')).to.not.be.null;
  });

  it('should not show other expenses', () => {
    const formData = {
      otherExpenses: [{ paidTo: '', purpose: '', amount: '', date: '' }],
    };

    const { queryByText } = render(<FinancialDisclosure formData={formData} />);

    expect(queryByText('frank')).to.be.null;
  });
});

describe('AdditionalInformation', () => {
  it('should render with files', () => {
    const formData = {
      'view:noDirectDeposit': false,
      bankAccount: {
        accountType: 'checking',
        accountNumber: '123',
        routingNumber: '333',
      },
      veteranAddress: {
        street: '123 street',
        city: 'Los Angeles',
        state: 'California',
        postalCode: '96785',
        country: 'USA',
      },
      email: 'bob@example.com',
      altEmail: 'alt-bob@example.com',
      files: [{ name: 'file 1.txt', size: 3200 }],
      noRapidProcessing: true,
    };
    const { queryByText } = render(
      <AdditionalInformation formData={formData} />,
    );
    expect(queryByText('bob@example.com')).to.not.be.null;
  });
  it('should render without files', () => {
    const formData = {
      'view:noDirectDeposit': true,
      bankAccountType: 'savings',
      noRapidProcessing: false,
    };
    const { queryByText } = render(
      <AdditionalInformation formData={formData} />,
    );
    expect(queryByText('Yes, I have uploaded all my documentation')).to.not.be
      .null;
  });
});

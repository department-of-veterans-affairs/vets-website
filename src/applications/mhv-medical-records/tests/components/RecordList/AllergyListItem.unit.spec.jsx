import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AllergyListItem from '../../../components/RecordList/AllergyListItem';

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AllergyListItem (mocha)', () => {
  const vistaRecord = {
    id: '123',
    name: 'Penicillin',
    date: 'March 15, 2024',
    type: 'Medication',
    reaction: ['Hives', 'Swelling'],
    location: 'VA Medical Center',
    observedOrReported: 'Observed',
    notes: 'Patient reported severe reaction',
    isOracleHealthData: false,
  };

  const oracleHealthRecord = {
    id: '456',
    name: 'Shellfish',
    date: 'January 10, 2024',
    type: 'Food',
    reaction: ['Difficulty breathing', 'Rash'],
    notes: 'DR. JOHN248 SMITH811 MD',
    isOracleHealthData: true,
  };

  it('renders allergy name as a link', () => {
    const screen = renderWithRouter(<AllergyListItem record={vistaRecord} />);

    const link = screen.getByTestId('allergy-link-123');
    expect(link).to.exist;
    expect(link.textContent).to.include('Penicillin');
    expect(link.getAttribute('href')).to.equal('/allergies/123');
  });

  it('displays date in web view', () => {
    const screen = renderWithRouter(<AllergyListItem record={vistaRecord} />);

    expect(screen.getAllByText('Date entered:')).to.have.length.greaterThan(0);
    expect(screen.getAllByText('March 15, 2024')).to.have.length.greaterThan(0);
  });

  it('includes screen reader text for date', () => {
    const screen = renderWithRouter(<AllergyListItem record={vistaRecord} />);

    const srText = screen.container.querySelector('.sr-only');
    expect(srText.textContent).to.equal('on March 15, 2024');
  });

  it('shows VistA-specific fields when isOracleHealthData is false', () => {
    const screen = renderWithRouter(<AllergyListItem record={vistaRecord} />);

    // These should be present for VistA records
    expect(screen.container.innerHTML).to.include('Location:');
    expect(screen.container.innerHTML).to.include('VA Medical Center');
    expect(screen.container.innerHTML).to.include('Observed or historical:');
    expect(screen.container.innerHTML).to.include('Observed');
  });

  it('shows Oracle Health-specific fields when isOracleHealthData is true', () => {
    const screen = renderWithRouter(
      <AllergyListItem record={oracleHealthRecord} />,
    );

    // Should show "Recorded by" for Oracle Health
    expect(screen.container.innerHTML).to.include('Recorded by:');
    expect(screen.container.innerHTML).to.include('DR. JOHN248 SMITH811 MD');

    // Should NOT show VistA-specific fields
    expect(screen.container.innerHTML).to.not.include('Location:');
    expect(screen.container.innerHTML).to.not.include(
      'Observed or historical:',
    );
  });

  it('always shows common fields for both data sources', () => {
    const screen = renderWithRouter(<AllergyListItem record={vistaRecord} />);

    expect(screen.container.innerHTML).to.include('Signs and symptoms:');
    expect(screen.container.innerHTML).to.include('Type of allergy:');
    expect(screen.container.innerHTML).to.include('Provider notes:');
  });

  it('handles minimal record data', () => {
    const minimalRecord = {
      id: '789',
      name: 'Test Allergy',
      date: 'December 01, 2023',
      isOracleHealthData: false,
    };

    const screen = renderWithRouter(<AllergyListItem record={minimalRecord} />);

    expect(screen.getByTestId('allergy-link-789')).to.exist;
    expect(screen.getAllByText('December 01, 2023')).to.have.length.greaterThan(
      0,
    );
  });
});

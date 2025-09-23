import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StandardAllergyListItem from '../../../../components/RecordList/AllergyListItems/StandardAllergyListItem';

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('StandardAllergyListItem (mocha)', () => {
  const defaultRecord = {
    id: '123',
    name: 'Penicillin',
    date: 'March 15, 2024',
    type: 'Medication',
    reaction: 'Hives, Swelling',
    location: 'VA Medical Center',
    observedOrReported: 'Observed',
    notes: 'Patient reported severe reaction',
  };

  it('renders allergy name as a link', () => {
    const screen = renderWithRouter(
      <StandardAllergyListItem record={defaultRecord} />,
    );

    const link = screen.getByTestId('allergy-link-123');
    expect(link).to.exist;
    expect(link.textContent).to.include('Penicillin');
    expect(link.getAttribute('href')).to.equal('/allergies/123');
  });

  it('displays date in web view', () => {
    const screen = renderWithRouter(
      <StandardAllergyListItem record={defaultRecord} />,
    );

    expect(screen.getAllByText('Date entered:')).to.have.length.greaterThan(0);
    expect(screen.getAllByText('March 15, 2024')).to.have.length.greaterThan(0);
  });

  it('includes screen reader text for date', () => {
    const screen = renderWithRouter(
      <StandardAllergyListItem record={defaultRecord} />,
    );

    const srText = screen.container.querySelector('.sr-only');
    expect(srText.textContent).to.equal('on March 15, 2024');
  });

  it('renders all print-only fields', () => {
    const screen = renderWithRouter(
      <StandardAllergyListItem record={defaultRecord} />,
    );

    // Check for print-only elements
    const printElements = screen.container.querySelectorAll('.print-only');
    expect(printElements.length).to.be.greaterThan(0);

    // Check for specific print content
    expect(screen.getByText('Signs and symptoms:')).to.exist;
    expect(screen.getByText('Type of allergy:')).to.exist;
    expect(screen.getByText('Location:')).to.exist;
    expect(screen.getByText('Observed or historical:')).to.exist;
    expect(screen.getByText('Provider notes:')).to.exist;
  });

  it('handles minimal record data', () => {
    const minimalRecord = {
      id: '456',
      name: 'Seafood',
      date: 'January 01, 2024',
    };

    const screen = renderWithRouter(
      <StandardAllergyListItem record={minimalRecord} />,
    );

    expect(screen.getByTestId('allergy-link-456')).to.exist;
    expect(screen.getAllByText('Seafood')).to.have.length.greaterThan(0);
    expect(screen.getAllByText('January 01, 2024')).to.have.length.greaterThan(
      0,
    );
  });

  it('renders with proper test ids', () => {
    const screen = renderWithRouter(
      <StandardAllergyListItem record={defaultRecord} />,
    );

    expect(screen.getByTestId('record-list-item')).to.exist;
    expect(screen.getByTestId('allergy-link-123')).to.exist;
  });
});

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UnifiedAllergyListItem from '../../../../components/RecordList/AllergyListItems/UnifiedAllergyListItem';

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UnifiedAllergyListItem (mocha)', () => {
  const defaultRecord = {
    id: '123',
    name: 'Penicillin',
    date: 'March 15, 2024',
    type: 'Medication',
    reaction: ['Hives', 'Swelling'],
    location: 'VA Medical Center',
    provider: 'Dr. Test Provider',
  };

  it('renders allergy name as a link', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const link = screen.getByTestId('allergy-name');
    expect(link).to.exist;
    expect(link.textContent).to.include('Penicillin');
    expect(link.getAttribute('href')).to.equal('/allergies/123');
  });

  it('displays allergy date', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const dateElement = screen.getByTestId('allergy-date');
    expect(dateElement.textContent).to.include('Date entered: March 15, 2024');
  });

  it('displays allergy type when present', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const typeElement = screen.getByTestId('allergy-type');
    expect(typeElement.textContent).to.include('Type: Medication');
  });

  it('displays reaction when present', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const reactionElement = screen.getByTestId('allergy-reactions');
    expect(reactionElement.textContent).to.include('Signs and symptoms:');
    expect(reactionElement.textContent).to.include('Hives');
    expect(reactionElement.textContent).to.include('Swelling');
  });

  it('displays location when present', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const locationElement = screen.getByTestId('allergy-location');
    expect(locationElement.textContent).to.include('VA Medical Center');
  });

  it('displays provider when present', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const providerElement = screen.getByTestId('allergy-provider');
    expect(providerElement.textContent).to.include('Dr. Test Provider');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalRecord = {
      id: '456',
      name: 'Seafood',
      date: 'January 01, 2024',
    };

    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={minimalRecord} />,
    );

    expect(screen.getByTestId('allergy-name')).to.exist;
    expect(screen.getByTestId('allergy-date')).to.exist;
    expect(screen.queryByTestId('allergy-type')).to.not.exist;
    expect(screen.queryByTestId('allergy-reactions')).to.not.exist;
    expect(screen.queryByTestId('allergy-location')).to.not.exist;
    expect(screen.queryByTestId('allergy-provider')).to.not.exist;
  });

  it('includes screen reader text for date', () => {
    const screen = renderWithRouter(
      <UnifiedAllergyListItem record={defaultRecord} />,
    );

    const srText = screen.getByTestId('sr-allergy-date');
    expect(srText.textContent).to.equal('on March 15, 2024');
  });
});

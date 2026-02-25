import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RadiologyListItem from '../../../components/RecordList/RadiologyListItem';
import { labTypes } from '../../../util/constants';

const renderWithRouter = component => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RadiologyListItem', () => {
  const mhvRecord = {
    id: 'r123-hash',
    name: 'DEXA, PERIPHERAL STUDY',
    date: 'January 6, 2004',
    type: labTypes.RADIOLOGY,
    orderedBy: 'DOE,JANE',
  };

  const cvixRecord = {
    id: 'r456-hash',
    name: 'CT THORAX W/O CONT',
    date: 'January 26, 2011',
    type: labTypes.CVIX_RADIOLOGY,
    orderedBy: 'PHYSLAST,JANE B',
  };

  it('renders radiology name as a link', () => {
    const screen = renderWithRouter(<RadiologyListItem record={mhvRecord} />);

    const link = screen.getByRole('link');
    expect(link).to.exist;
    expect(link.textContent).to.include('DEXA, PERIPHERAL STUDY');
    expect(link.getAttribute('href')).to.equal('/imaging-results/r123-hash');
  });

  it('displays date', () => {
    const screen = renderWithRouter(<RadiologyListItem record={mhvRecord} />);

    expect(screen.getByText('January 6, 2004')).to.exist;
  });

  it('includes screen reader text for date', () => {
    const screen = renderWithRouter(<RadiologyListItem record={mhvRecord} />);

    const srText = screen.container.querySelector('.sr-only');
    expect(srText.textContent).to.equal('on January 6, 2004');
  });

  it('displays ordered by for RADIOLOGY type', () => {
    const screen = renderWithRouter(<RadiologyListItem record={mhvRecord} />);

    expect(screen.getByText('Ordered by DOE,JANE')).to.exist;
  });

  it('displays ordered by for CVIX_RADIOLOGY type', () => {
    const screen = renderWithRouter(<RadiologyListItem record={cvixRecord} />);

    expect(screen.getByText('Ordered by PHYSLAST,JANE B')).to.exist;
  });

  it('does not display ordered by for other record types', () => {
    const otherTypeRecord = { ...mhvRecord, type: 'OTHER', orderedBy: 'SMITH' };
    const screen = renderWithRouter(
      <RadiologyListItem record={otherTypeRecord} />,
    );

    expect(screen.queryByText(/Ordered by/)).to.not.exist;
  });

  it('handles minimal record data', () => {
    const minimalRecord = {
      id: 'r789',
      name: 'Test Radiology',
      date: 'December 01, 2023',
      type: labTypes.RADIOLOGY,
    };

    const screen = renderWithRouter(
      <RadiologyListItem record={minimalRecord} />,
    );

    expect(screen.getByRole('link')).to.exist;
    expect(screen.getByText('Test Radiology')).to.exist;
    expect(screen.getByText('December 01, 2023')).to.exist;
  });

  it('renders with data-testid for record list item', () => {
    const screen = renderWithRouter(<RadiologyListItem record={mhvRecord} />);

    expect(screen.getByTestId('record-list-item')).to.exist;
  });
});

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DischargeSummaryListItem from '../../../../components/RecordList/CareNotesListItems/DischargeSummaryListItem';

describe('DischargeSummaryListItem', () => {
  const renderWithRouter = ui => render(<MemoryRouter>{ui}</MemoryRouter>);

  const record = {
    id: '123',
    name: 'Discharge Summary',
    admissionDate: '2025-09-01',
    location: 'VA Hospital',
    dischargedBy: 'Dr. Smith',
  };

  it('renders the record name', () => {
    const screen = renderWithRouter(
      <DischargeSummaryListItem record={record} />,
    );
    expect(screen.getByTestId('note-name').textContent).to.contain(
      'Discharge Summary',
    );
  });

  it('renders the admission date', () => {
    const screen = renderWithRouter(
      <DischargeSummaryListItem record={record} />,
    );
    expect(screen.getByTestId('note-item-date').textContent).to.contain(
      '2025-09-01',
    );
  });

  it('renders the location', () => {
    const screen = renderWithRouter(
      <DischargeSummaryListItem record={record} />,
    );
    expect(screen.getByTestId('note-location').textContent).to.contain(
      'VA Hospital',
    );
  });

  it('renders the discharged by field', () => {
    const screen = renderWithRouter(
      <DischargeSummaryListItem record={record} />,
    );
    expect(screen.getByTestId('note-discharged-by').textContent).to.contain(
      'Dr. Smith',
    );
  });
});

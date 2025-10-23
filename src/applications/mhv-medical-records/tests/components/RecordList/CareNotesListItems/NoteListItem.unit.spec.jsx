import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NoteListItem from '../../../../components/RecordList/CareNotesListItems/NoteListItem';

describe('NoteListItem', () => {
  const renderWithRouter = ui => render(<MemoryRouter>{ui}</MemoryRouter>);

  const record = {
    id: '456',
    name: 'Progress Note',
    date: '2025-09-02',
    location: 'VA Clinic',
    writtenBy: 'Nurse Jane',
  };

  it('renders the record name', () => {
    const screen = renderWithRouter(<NoteListItem record={record} />);
    expect(screen.getByTestId('note-name').textContent).to.contain(
      'Progress Note',
    );
  });

  it('renders the date entered', () => {
    const screen = renderWithRouter(<NoteListItem record={record} />);
    expect(screen.getByTestId('note-item-date').textContent).to.contain(
      'Date entered: 2025-09-02',
    );
  });

  it('renders the location', () => {
    const screen = renderWithRouter(<NoteListItem record={record} />);
    expect(screen.getByTestId('note-location').textContent).to.equal(
      'VA Clinic',
    );
  });

  it('renders the written by field', () => {
    const screen = renderWithRouter(<NoteListItem record={record} />);
    expect(screen.getByTestId('note-written-by').textContent).to.equal(
      'Nurse Jane',
    );
  });
});

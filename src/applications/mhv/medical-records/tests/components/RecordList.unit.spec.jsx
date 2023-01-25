import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import RecordList from '../../components/RecordList';
import vaccines from '../fixtures/vaccines.json';

describe('Record list component', () => {
  it('renders without errors', () => {
    const screen = render(<RecordList records={vaccines} type="vaccine" />);
    expect(screen.getByText('Displaying', { exact: false })).to.exist;
  });

  it('displays a list of records when records are provided', async () => {
    const screen = render(<RecordList records={vaccines} type="vaccine" />);
    let recordItems = null;
    await waitFor(() => {
      recordItems = screen.getAllByTestId('record-list-item');
    });
    expect(recordItems.length).to.equal(5);
  });
});

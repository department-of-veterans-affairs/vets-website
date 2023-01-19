import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import RecordList from '../../components/RecordList';
import vaccines from '../fixtures/vaccines.json';

describe('Record list component', () => {
  it('renders without errors', () => {
    const screen = render(<RecordList records={vaccines} type="vaccine" />);
    expect(screen.getByText('Displaying', { exact: false })).to.exist;
  });

  it('displays a list of records when records are provided', () => {
    const screen = render(<RecordList records={vaccines} type="vaccine" />);
    const recordItems = screen
      .getAllByTestId('record-list-item')
      ?.map(el => el.value);
    expect(recordItems.length).to.equal(5);
  });
});

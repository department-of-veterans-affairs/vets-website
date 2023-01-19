import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import RecordListItem from '../../components/RecordListItem';

describe('Record list item component', () => {
  it('renders without errors', () => {
    const screen = render(
      <RecordListItem name="COVID-19 vaccine" date="July 15, 2022" />,
    );
    expect(screen.getByText('COVID-19 vaccine', { exact: true })).to.exist;
  });

  it('should contain the name and date of the record', () => {
    const screen = render(
      <RecordListItem name="Flu vaccine" date="2022-07-15T17:42:46.000Z" />,
    );
    const recordName = screen.getByText('Flu vaccine', { exact: true });
    const recordDate = screen.getByText('July', { exact: false });
    expect(recordName).to.exist;
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = render(
      <RecordListItem name="Td vaccine" date="July 15, 2022" />,
    );
    const recordDetailsLink = screen.getByRole('link', {
      name: 'View details',
    });
    expect(recordDetailsLink).to.exist;
  });
});

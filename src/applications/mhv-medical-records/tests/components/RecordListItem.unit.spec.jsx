import { expect } from 'chai';
import React from 'react';
import { beforeEach } from 'mocha';
import { render } from '@testing-library/react';
import RecordListItem from '../../components/RecordList/RecordListItem';
import vaccine from '../fixtures/vaccine.json';
import { convertVaccine } from '../../reducers/vaccines';

describe('Record list component', () => {
  let screen = null;
  beforeEach(() => {
    screen = render(
      <RecordListItem records={convertVaccine(vaccine)} type="invalidType" />,
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('shows something went wrong when type does not match any record type', () => {
    const message = screen.getAllByText(
      'Something went wrong, please try again.',
      {
        exact: false,
        selector: 'p',
      },
    );
    expect(message).to.exist;
  });
});

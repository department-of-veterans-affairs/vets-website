import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DuplicateRecordsAlert from '../../../components/shared/DuplicateRecordsAlert';

describe('DuplicateRecordsAlert', () => {
  it('renders the alert', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert).to.exist;
  });

  it('renders with info status', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('status')).to.equal('info');
  });

  it('renders the correct headline', () => {
    const { getByText } = render(<DuplicateRecordsAlert />);
    expect(getByText('You may notice duplicate records for a time')).to.exist;
  });

  it('renders the correct body text', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.textContent).to.include(
      'removed or changed any records. But recent updates may show duplicate records.',
    );
  });

  it('has the correct id attribute', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('id')).to.equal('duplicate-records-alert');
  });

  it('has the no-print class for print exclusion', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('class')).to.include('no-print');
  });

  it('has the correct Datadog action name', () => {
    const { getByTestId } = render(<DuplicateRecordsAlert />);
    const alert = getByTestId('duplicate-records-info-alert');
    expect(alert.getAttribute('data-dd-action-name')).to.equal(
      'You may notice duplicate records for a time',
    );
  });
});

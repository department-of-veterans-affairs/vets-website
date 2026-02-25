import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SubmissionsPageResults from '../../../components/SubmissionsPageResults';

describe('SubmissionsPageResults', () => {
  it('renders empty state when no submissions provided', () => {
    const { container } = render(<SubmissionsPageResults submissions={[]} />);
    const fallback = container.querySelector(
      '[data-testid="submissions-table-fetcher-empty"]',
    );
    expect(fallback).to.exist;
    expect(fallback.textContent).to.equal('No form submissions found');
  });

  it('renders list when submissions are present', () => {
    const submissions = [
      {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        submittedDate: '2024-01-01',
        confirmationNumber: '123',
        vbmsStatus: 'received',
        vbmsReceivedDate: '2024-01-02',
        formType: '21-22',
        url: false,
      },
    ];

    const { container } = render(
      <SubmissionsPageResults submissions={submissions} />,
    );
    const list = container.querySelector('[data-testid="submissions-card"]');
    expect(list).to.exist;
  });

  it('renders the submission name inside the card', () => {
    const submissions = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        submittedDate: '2024-01-01',
        confirmationNumber: 'XYZ123',
        vbmsStatus: 'received',
        vbmsReceivedDate: '2024-01-02',
        formType: '21-22',
        url: false,
      },
    ];

    const { container } = render(
      <SubmissionsPageResults submissions={submissions} />,
    );
    const name = container.querySelector('h3');
    expect(name).to.exist;
    expect(name.textContent).to.equal('Johnson, Alice');
  });

  it('renders confirmation number and VBMS status', () => {
    const submissions = [
      {
        id: '1',
        firstName: 'Bob',
        lastName: 'Builder',
        submittedDate: '2024-01-01',
        confirmationNumber: 'CONFIRM-789',
        vbmsStatus: 'received',
        vbmsReceivedDate: '2024-01-02',
        formType: '21-22',
        url: false,
      },
    ];

    const { container } = render(
      <SubmissionsPageResults submissions={submissions} />,
    );
    const statusBlock = container.querySelector('.submission__card-status');
    const statusBlockRow = container.querySelector(
      '.submission__card-status--row',
    );

    expect(statusBlock).to.exist;
    expect(statusBlock.textContent).to.include('CONFIRM-789');
    expect(statusBlockRow.textContent).to.include('VBMS eFolder status');
    expect(statusBlockRow.textContent).to.include('Received');
  });

  it('renders form type with "packet" if applicable', () => {
    const submissions = [
      {
        id: '1',
        firstName: 'Clara',
        lastName: 'Oswald',
        submittedDate: '2024-01-01',
        confirmationNumber: '999',
        vbmsStatus: 'received',
        vbmsReceivedDate: '2024-01-02',
        formType: '21-22',
        packet: true,
        url: false,
      },
    ];

    const { container } = render(
      <SubmissionsPageResults submissions={submissions} />,
    );
    const formType = container.querySelector('.submission__card-form-name');
    expect(formType).to.exist;
    expect(formType.textContent).to.include('21-22 packet');
  });
});

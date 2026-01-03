import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';

const renderWithRouter = ui => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CaseProgressDescription', () => {
  it('renders step 1 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={1} />,
    );

    getByText(
      /Your application for VR&E benefits has not yet been received and\/or is being routed for evaluation\./i,
    );
  });

  it('renders step 2 description (includes va-link)', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={2} />,
    );

    getByText(/Once your VR&E Benefits Application has been deemed complete/i);

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'VR&E Check My Eligibility web page.',
    );
  });

  it('renders step 3 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={3} />,
    );

    getByText(/VR-03 Appointment and Orientation Notification Letter/i);
    getByText(/Orientation Tools and Resources/i);
  });

  it('renders step 4 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={4} />,
    );

    getByText(/telecounseling appointment/i);
    getByText(/request an in-person appointment/i);
  });

  it('renders step 5 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={5} />,
    );

    getByText(/Entitlement Determination for Chapter 31 Benefits/i);
    getByText(/Entitlement Determination Date/i);
  });

  it('renders step 6 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={6} />,
    );

    getByText(/rehabilitation goal/i);
    getByText(/Reemployment/i);
    getByText(/Self-Employment/i);
  });

  it('renders step 7 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={7} />,
    );

    getByText(/Rehabilitation Plan or Career Track is approved/i);
    getByText(/your Chapter 31 benefits will begin/i);
  });

  it('returns null for unknown step', () => {
    const { container } = renderWithRouter(
      <CaseProgressDescription step={999} />,
    );
    expect(container.querySelector('p')).to.equal(null);
  });
});

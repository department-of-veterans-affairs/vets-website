import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';

const renderWithRouter = ui => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CaseProgressDescription', () => {
  // --------------------------
  // Step 1
  // --------------------------
  it('renders step 1 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={1} status="PENDING" />,
    );

    getByText(
      /Your application for VR&E benefits has not yet been received and\/or is being routed for evaluation\./i,
    );
  });

  it('renders step 1 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={1} status="ACTIVE" />,
    );

    getByText(/Your application for VR&E benefits has been received\./i);
  });

  it('renders step 1 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={1} status="COMPLETED" />,
    );

    getByText(/has been received and is being evaluated\./i);
  });

  // --------------------------
  // Step 2
  // --------------------------
  it('renders step 2 PENDING description (includes va-link)', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={2} status="PENDING" />,
    );

    getByText(
      /Once your VR&E Benefits Application has been deemed complete, it will be assessed for basic eligibility\./i,
    );

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'VR&E Check My Eligibility web page.',
    );
  });

  it('renders step 2 ACTIVE description (includes va-link)', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={2} status="ACTIVE" />,
    );

    getByText(/currently being evaluated for basic eligibility/i);

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'VR&E Check My Eligibility web page.',
    );
  });

  it('renders step 2 COMPLETED description (no eligibility va-link)', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={2} status="COMPLETED" />,
    );
    getByText(/has been reviewed for basic eligibility/i);
    getByText(/Preparing for the Next Steps/i);

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.equal(null);
  });

  // --------------------------
  // Step 3
  // --------------------------
  it('renders step 3 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={3} status="PENDING" />,
    );

    getByText(
      /Once your application for VR&E Chapter 31 benefits is processed/i,
    );
    getByText(/VR-03 Appointment and Orientation Notification Letter/i);
    getByText(/Orientation Tools and Resources/i);
  });

  it('renders step 3 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={3} status="ACTIVE" />,
    );

    getByText(/Notification Letter is being generated/i);
    getByText(/Orientation Tools and Resources/i);
  });

  it('renders step 3 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={3} status="COMPLETED" />,
    );

    getByText(/completed your Orientation/i);
  });

  // --------------------------
  // Step 4
  // --------------------------
  it('renders step 4 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );

    getByText(/telecounseling appointment/i);
    getByText(/request an in-person appointment/i);
  });

  it('renders step 4 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="ACTIVE" />,
    );

    getByText(/uploaded to your VA eFolder/i);
    getByText(/Career Planning/i);
  });

  it('renders step 4 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="COMPLETED" />,
    );

    getByText(/met with your VR&E counselor/i);
    getByText(/Entitlement Determination/i);
  });

  // --------------------------
  // Step 5
  // --------------------------
  it('renders step 5 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={5} status="PENDING" />,
    );

    getByText(/confirm your Entitlement Determination/i);
    getByText(/Entitlement Determination Date/i);
  });

  it('renders step 5 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={5} status="ACTIVE" />,
    );

    getByText(/Counselor is completing the Entitlement Determination Review/i);
    getByText(/Career Planning Page/i);
  });

  it('renders step 5 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={5} status="COMPLETED" />,
    );

    getByText(/Entitlement Determination Date has been established/i);
    getByText(/Vocational Exploration/i);
  });

  // --------------------------
  // Step 6
  // --------------------------
  it('renders step 6 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={6} status="PENDING" />,
    );

    getByText(/rehabilitation goal/i);
    getByText(/Reemployment/i);
    getByText(/Self-Employment/i);
  });

  it('renders step 6 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={6} status="ACTIVE" />,
    );

    getByText(/establish and initiate your Chapter 31 Rehabilitation Plan/i);
    getByText(/uploaded to your VA Electronic Folder/i);
  });

  it('renders step 6 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={6} status="COMPLETED" />,
    );

    getByText(/Rehabilitation Plan is complete/i);
    getByText(/expected start date/i);
  });

  // --------------------------
  // Step 7
  // --------------------------
  it('renders step 7 PENDING description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={7} status="PENDING" />,
    );

    getByText(/Rehabilitation Plan or Career Track is approved/i);
    getByText(/your Chapter 31 benefits will begin/i);
  });

  it('renders step 7 ACTIVE description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={7} status="ACTIVE" />,
    );

    getByText(/has been initiated/i);
    getByText(/estimated completion date/i);
  });

  it('renders step 7 COMPLETED description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={7} status="COMPLETED" />,
    );

    getByText(
      /has been completed and your goals and objectives have been achieved/i,
    );
  });

  // --------------------------
  // Default
  // --------------------------
  it('returns null for unknown step', () => {
    const { container } = renderWithRouter(
      <CaseProgressDescription step={999} status="PENDING" />,
    );

    expect(container.innerHTML).to.equal('');
  });
});

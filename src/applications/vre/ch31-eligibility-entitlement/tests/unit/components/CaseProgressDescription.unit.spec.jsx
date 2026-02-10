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

    getByText(/received your application for VR&E benefits\./i);
    getByText(/nothing you need to do right now\./i);
  });

  it('renders step 2 description (includes va-link)', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={2} />,
    );

    getByText(/currently being reviewed for basic eligibility/i);
    getByText(/web page\./i);

    const link = container.querySelector('va-link[href="/"]');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('VR&E Check My Eligibility');
  });

  it('renders step 3 description and orientation content', () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={3} />,
    );

    getByText(/basic eligibility has been determined/i);
    const orientationMentions = container.querySelectorAll('p');
    expect(
      Array.from(orientationMentions).some(node =>
        /Orientation Video/i.test(node.textContent),
      ),
    ).to.equal(true);
    getByText(/Orientation Completion/i);

    const card = container.querySelector('va-card');
    expect(card).to.exist;
  });

  it('renders step 4 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={4} />,
    );

    getByText(/check your email for confirmation/i);
    getByText(/Career Planning/i);
  });

  it('renders step 5 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={5} />,
    );

    getByText(/Entitlement Determination Review/i);
    getByText(/Career Planning/i);
  });

  it('renders step 6 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={6} />,
    );

    getByText(/Rehabilitation Plan/i);
    getByText(/review and approval/i);
  });

  it('renders step 7 description', () => {
    const { getByText } = renderWithRouter(
      <CaseProgressDescription step={7} />,
    );

    getByText(/Career Track has been initiated/i);
  });

  // --------------------------
  // Default
  // --------------------------
  it('returns null for unknown step', () => {
    const { container } = renderWithRouter(
      <CaseProgressDescription step={999} />,
    );

    expect(container.innerHTML).to.equal('');
  });
});

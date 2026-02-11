import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import CaseProgressDescription from '../../../components/CaseProgressDescription';

const renderWithRouter = ui => render(<MemoryRouter>{ui}</MemoryRouter>);

function selectVaRadio(container, value) {
  const vaRadio = container.querySelector('va-radio');
  expect(vaRadio).to.exist;
  // Simulate va-radio value change (shadow event)
  fireEvent(
    vaRadio,
    new CustomEvent('vaValueChange', {
      detail: { value },
      bubbles: true,
      composed: true,
    }),
  );
}

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

  it('renders step 4 PENDING instructions and radio options', () => {
    const { container, getByText, getAllByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );
    getByText(/VR&E has received and processed your application/i);
    getAllByText(/Schedule your Initial Evaluation Counselor Meeting/i);

    // Find va-radio and its options
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.equal(2);

    // Labels
    expect(
      Array.from(options).some(
        opt => opt.getAttribute('label') === 'Telecounseling meeting',
      ),
    ).to.be.true;
    expect(
      Array.from(options).some(
        opt => opt.getAttribute('label') === 'In-person appointment',
      ),
    ).to.be.true;

    // No VaAdditionalInfo or VaButton yet
    expect(container.querySelector('va-additional-info')).to.be.null;
    expect(container.querySelector('va-button')).to.be.null;
  });

  it('shows Telecounseling info and submit when selected', async () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );
    selectVaRadio(container, 'Telecounseling meeting');

    // Wait for info and button to appear
    await waitFor(() => {
      const btn = container.querySelector('va-button');
      expect(btn).to.exist;
    });

    // Info content
    getByText(/Telecounseling uses Microsoft Teams/i);
    getByText(/private setting to ensure confidentiality/i);
    // Button
    const btn = container.querySelector('va-button');
    expect(btn.getAttribute('text')).to.equal('Submit');
  });

  it('shows In-person info and submit when selected', async () => {
    const { container, getByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );
    selectVaRadio(container, 'In-person appointment');

    await waitFor(() => {
      const btn = container.querySelector('va-button');
      expect(btn).to.exist;
    });

    getByText(
      /If your appointment is in-person appointment at a specified location/i,
    );
    getByText(
      /Plan for the initial evaluation appointment to last two hours or more/i,
    );
    getByText(/Do not bring minor children with you/i);
    getByText(/you may bring the documents outlined/i);

    const btn = container.querySelector('va-button');
    expect(btn.getAttribute('text')).to.equal('Submit');
  });

  it('submits Telecounseling and shows confirmation', async () => {
    const { container, getByText, queryByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );
    selectVaRadio(container, 'Telecounseling meeting');
    await waitFor(() => {
      expect(container.querySelector('va-button')).to.exist;
    });
    const btn = container.querySelector('va-button');
    fireEvent.click(btn);

    // Confirmation text
    await waitFor(() => {
      getByText(/You have scheduled your Initial Evaluation Appointment/i);
      getByText(/please use your appointment confirmation/i);
    });

    // Radio and options gone
    expect(container.querySelector('va-radio')).to.be.null;
    expect(queryByText(/Schedule your Initial Evaluation Counselor Meeting/i))
      .to.be.null;
  });

  it('submits In-person and shows confirmation', async () => {
    const { container, getByText, queryByText } = renderWithRouter(
      <CaseProgressDescription step={4} status="PENDING" />,
    );
    selectVaRadio(container, 'In-person appointment');
    await waitFor(() => {
      expect(container.querySelector('va-button')).to.exist;
    });
    const btn = container.querySelector('va-button');
    fireEvent.click(btn);

    await waitFor(() => {
      getByText(/You have scheduled your Initial Evaluation Appointment/i);
      getByText(/please use your appointment confirmation/i);
    });

    expect(container.querySelector('va-radio')).to.be.null;
    expect(queryByText(/Schedule your Initial Evaluation Counselor Meeting/i))
      .to.be.null;
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

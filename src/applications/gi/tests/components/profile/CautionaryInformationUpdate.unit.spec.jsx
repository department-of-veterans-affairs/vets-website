import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CautionaryInformationUpdate from '../../../components/profile/CautionaryInformationUpdate';

describe('<CautionaryInformationUpdate> (basic render + caution flags + showModal coverage)', () => {
  const baseInstitution = {
    facilityCode: '21805113',
    complaints: { mainCampusRollUp: 0 },
    cautionFlags: [],
    schoolClosing: false,
    schoolClosingOn: null,
    website: 'https://example.edu',
  };

  it('renders without crashing and does NOT show the warnings block when no flags and no closing', () => {
    const { container, queryByText } = render(
      <MemoryRouter>
        <CautionaryInformationUpdate
          institution={baseInstitution}
          showModal={() => {}}
        />
      </MemoryRouter>,
    );

    expect(container).to.exist;
    expect(container.firstChild).to.exist;
    expect(queryByText(/Alerts from VA and other federal agencies/i)).to.equal(
      null,
    );
  });

  it('shows the warnings block when the school is closing (even with no flags)', () => {
    const institution = { ...baseInstitution, schoolClosing: true };
    const { getByText } = render(
      <MemoryRouter>
        <CautionaryInformationUpdate
          institution={institution}
          showModal={() => {}}
        />
      </MemoryRouter>,
    );

    expect(getByText(/Alerts from VA and other federal agencies/i)).to.exist;
  });

  it('invokes showModal("studentComplaints") when the top LearnMoreLabel is clicked', () => {
    const showModal = sinon.spy();
    const { container } = render(
      <MemoryRouter>
        <CautionaryInformationUpdate
          institution={baseInstitution}
          showModal={showModal}
        />
      </MemoryRouter>,
    );

    const btn = container.querySelector('#student-complaints');
    expect(btn).to.exist;

    fireEvent.click(btn);

    expect(showModal.calledOnce).to.be.true;
    expect(showModal.getCall(0).args[0]).to.equal('studentComplaints');
  });

  it('invokes showModal("aboutAllCampuses") when the “about all campuses” LearnMoreLabel is clicked', () => {
    const institution = {
      ...baseInstitution,
      complaints: { mainCampusRollUp: 3 },
    };
    const showModal = sinon.spy();

    const { container } = render(
      <MemoryRouter>
        <CautionaryInformationUpdate
          institution={institution}
          showModal={showModal}
        />
      </MemoryRouter>,
    );

    const aboutBtn = container.querySelector('#about-all-campuses');
    expect(aboutBtn).to.exist;

    fireEvent.click(aboutBtn);

    expect(showModal.calledOnce).to.be.true;
    expect(showModal.getCall(0).args[0]).to.equal('aboutAllCampuses');
  });
});

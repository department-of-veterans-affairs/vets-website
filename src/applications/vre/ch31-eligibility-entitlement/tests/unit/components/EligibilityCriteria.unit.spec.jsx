import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import EligibilityCriteria from '../../../components/EligibilityCriteria';

const baseVeteranProfile = {
  characterOfDischarge: 'Honorable',
  servicePeriod: [
    { serviceBeganDate: '1989-01-01Z', serviceEndDate: '2017-07-04Z' },
  ],
};

const renderComp = (overrides = {}) => {
  const props = {
    veteranProfile: baseVeteranProfile,
    disabilityRating: { combinedScd: 0, scdDetails: [] },
    irndDate: 'N/A',
    eligibilityTerminationDate: null,
    qualifyingMilitaryServiceStatus: 'Eligible',
    characterOfDischargeStatus: 'Eligible',
    disabilityRatingStatus: 'Eligible',
    irndStatus: 'Eligible',
    eligibilityTerminationDateStatus: 'Eligible',
    ...overrides,
  };
  return render(<EligibilityCriteria {...props} />);
};

const getRowLi = (container, labelStartsWith) => {
  const strongs = Array.from(container.querySelectorAll('li strong'));
  const match = strongs.find(s =>
    (s.textContent || '').trim().startsWith(labelStartsWith),
  );
  if (!match) {
    throw new Error(`Row not found for label: ${labelStartsWith}`);
  }
  return match.closest('li');
};

describe('EligibilityCriteria', () => {
  it('renders heading and service period entries', () => {
    const { getByRole, getByText } = renderComp();

    expect(
      getByRole('heading', {
        name: /Basic eligibility criteria/i,
      }),
    ).to.exist;
    expect(getByText(/Entered Active Duty \(EOD\):/i)).to.exist;
    expect(getByText(/Released:/i)).to.exist;
  });

  it('icons reflect status props for all rows', () => {
    const { container } = renderComp({
      qualifyingMilitaryServiceStatus: 'Eligible', // check + green
      characterOfDischargeStatus: 'Ineligible', // close + secondary-dark
      disabilityRatingStatus: 'Eligible', // check + green
      irndStatus: 'Eligible', // check + green
      eligibilityTerminationDateStatus: 'Ineligible', // close + secondary-dark
    });

    {
      const li = getRowLi(container, 'Qualifying military service:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'check');
      expect(icon).to.have.class('vads-u-color--green');
    }

    {
      const li = getRowLi(container, 'Character of Discharge:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'close');
      expect(icon).to.have.class('vads-u-color--secondary-dark');
    }

    {
      const li = getRowLi(container, 'Disability rating:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'check');
      expect(icon).to.have.class('vads-u-color--green');
    }

    {
      const li = getRowLi(container, 'Eligibility termination date:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'close');
      expect(icon).to.have.class('vads-u-color--secondary-dark');
    }
  });

  it('renders SCD details list when provided (inside additional info)', () => {
    const { container, getByText } = renderComp({
      disabilityRating: {
        combinedScd: 40,
        scdDetails: [
          { code: '1111', name: 'Knee', percentage: 10 },
          { code: '2222', name: 'Back', percentage: 30 },
        ],
      },
    });

    const addl = container.querySelector(
      'va-additional-info[trigger="SCD details"]',
    );
    expect(addl).to.exist;

    expect(getByText(/1111 - Knee - 10%/)).to.exist;
    expect(getByText(/2222 - Back - 30%/)).to.exist;
  });

  it('renders multiple periods correctly (inside additional info)', () => {
    const { container } = renderComp({
      veteranProfile: {
        characterOfDischarge: 'Honorable',
        servicePeriod: [
          { serviceBeganDate: '2000-01-01Z', serviceEndDate: '2004-01-01Z' },
          { serviceBeganDate: '2005-01-01Z', serviceEndDate: '2010-01-01Z' },
        ],
      },
    });

    const addl = container.querySelector(
      'va-additional-info[trigger="Service history details"]',
    );
    expect(addl).to.exist;
    expect(addl.textContent).to.match(/Applicant has\s*2\s*periods\b/i);
  });
});

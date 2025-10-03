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

    expect(getByRole('heading', { name: /Eligibility Criteria/i })).to.exist;
    expect(getByText(/Applicant has\s*1\s*period\(s\)/i)).to.exist;
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

    // Qualifying Military Service
    {
      const li = getRowLi(container, 'Qualifying Military Service:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'check');
      expect(icon).to.have.class('vads-u-color--green');
    }

    // Character of discharge
    {
      const li = getRowLi(container, 'Character of discharge:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'close');
      expect(icon).to.have.class('vads-u-color--secondary-dark');
    }

    // Disability Rating
    {
      const li = getRowLi(container, 'Disability Rating:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'check');
      expect(icon).to.have.class('vads-u-color--green');
    }

    // Eligibility Termination Date
    {
      const li = getRowLi(container, 'Eligibility Termination Date:');
      const icon = li.querySelector('va-icon');
      expect(icon).to.have.attribute('icon', 'close');
      expect(icon).to.have.class('vads-u-color--secondary-dark');
    }
  });

  it('shows disability rating with % when numeric; em dash when not numeric', () => {
    const { container, rerender } = renderComp({
      disabilityRating: { combinedScd: 15, scdDetails: [] },
    });

    // numeric -> "15%"
    let li = getRowLi(container, 'Disability Rating:');
    expect(li).to.contain.text('Disability Rating: 15%');

    // numeric string -> current component treats as non-numeric => em dash
    rerender(
      <EligibilityCriteria
        veteranProfile={baseVeteranProfile}
        disabilityRating={{ combinedScd: '20', scdDetails: [] }}
        irndDate="N/A"
        eligibilityTerminationDate={null}
        qualifyingMilitaryServiceStatus="Eligible"
        characterOfDischargeStatus="Eligible"
        disabilityRatingStatus="Eligible"
        irndStatus="Eligible"
        eligibilityTerminationDateStatus="Eligible"
      />,
    );
    li = getRowLi(container, 'Disability Rating:');
    expect(li).to.contain.text('Disability Rating: —');

    // missing -> em dash
    rerender(
      <EligibilityCriteria
        veteranProfile={baseVeteranProfile}
        disabilityRating={{ combinedScd: null, scdDetails: [] }}
        irndDate="N/A"
        eligibilityTerminationDate={null}
        qualifyingMilitaryServiceStatus="Eligible"
        characterOfDischargeStatus="Eligible"
        disabilityRatingStatus="Eligible"
        irndStatus="Eligible"
        eligibilityTerminationDateStatus="Eligible"
      />,
    );
    li = getRowLi(container, 'Disability Rating:');
    expect(li).to.contain.text('Disability Rating: —');
  });

  it('renders SCD details list when provided', () => {
    const { getByText } = renderComp({
      disabilityRating: {
        combinedScd: 40,
        scdDetails: [
          { code: '1111', name: 'Knee', percentage: 10 },
          { code: '2222', name: 'Back', percentage: 30 },
        ],
      },
    });

    expect(getByText(/SCD Details:/i)).to.exist;
    expect(getByText(/1111 - Knee - 10%/)).to.exist;
    expect(getByText(/2222 - Back - 30%/)).to.exist;
  });

  it('renders multiple periods correctly', () => {
    const { getByText } = renderComp({
      veteranProfile: {
        characterOfDischarge: 'Honorable',
        servicePeriod: [
          { serviceBeganDate: '2000-01-01Z', serviceEndDate: '2004-01-01Z' },
          { serviceBeganDate: '2005-01-01Z', serviceEndDate: '2010-01-01Z' },
        ],
      },
    });

    expect(getByText(/Applicant has\s*2\s*period\(s\)/i)).to.exist;
  });
});

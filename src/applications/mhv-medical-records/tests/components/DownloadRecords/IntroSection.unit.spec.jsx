import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import IntroSection from '../../../components/DownloadRecords/IntroSection';
import { dataSourceTypes } from '../../../util/constants';

describe('IntroSection', () => {
  describe('Vista-only (default)', () => {
    it('renders the h1 heading', () => {
      const { getByRole } = render(<IntroSection />);
      const heading = getByRole('heading', { level: 1 });
      expect(heading).to.exist;
      expect(heading.textContent).to.eq(
        'Download your medical records reports',
      );
    });

    it('renders the intro paragraph about Blue Button report', () => {
      const { getByText } = render(<IntroSection />);
      expect(getByText(/Download your VA medical records as a single report/i))
        .to.exist;
      expect(getByText(/VA Blue Button® report/i)).to.exist;
    });
  });

  describe('OH-only', () => {
    it('renders OH-only intro when dataSourceType is ohOnly', () => {
      const ohFacilityNamesBeforeCutover = [
        'OH Facility (before January 1, 2022)',
      ];
      const ohFacilityNamesAfterCutover = [
        'OH Facility (January 1, 2022 - present)',
      ];
      const { getByRole, getAllByText, getByText } = render(
        <IntroSection
          dataSourceType={dataSourceTypes.OH_ONLY}
          ohFacilityNamesBeforeCutover={ohFacilityNamesBeforeCutover}
          ohFacilityNamesAfterCutover={ohFacilityNamesAfterCutover}
        />,
      );

      const heading = getByRole('heading', { level: 1 });
      expect(heading.textContent).to.eq(
        'Download your medical records reports',
      );

      expect(getByText(/Continuity of Care Document/i)).to.exist;
      // Facility name appears in both before and after lists
      expect(getAllByText(/OH Facility/i).length).to.be.greaterThan(0);
    });
  });

  describe('Both VistA and OH', () => {
    it('renders combined intro when dataSourceType is both', () => {
      const ohFacilityNamesBeforeCutover = [
        'OH Facility (before January 1, 2022)',
      ];
      const ohFacilityNamesAfterCutover = [
        'OH Facility (January 1, 2022 - present)',
      ];
      const vistaFacilityNames = ['VistA Facility'];
      const { getByRole, getByText } = render(
        <IntroSection
          dataSourceType={dataSourceTypes.BOTH}
          ohFacilityNamesBeforeCutover={ohFacilityNamesBeforeCutover}
          ohFacilityNamesAfterCutover={ohFacilityNamesAfterCutover}
          vistaFacilityNames={vistaFacilityNames}
        />,
      );

      const heading = getByRole('heading', { level: 1 });
      expect(heading.textContent).to.eq(
        'Download your medical records reports',
      );

      // Should mention Blue Button and self-entered information
      expect(getByText(/VA Blue Button report/i)).to.exist;
      expect(getByText(/self-entered health information/i)).to.exist;
    });

    it('renders both facility lists', () => {
      const ohFacilityNamesBeforeCutover = [
        'Oracle Health Site (before January 1, 2022)',
      ];
      const ohFacilityNamesAfterCutover = [
        'Oracle Health Site (January 1, 2022 - present)',
      ];
      const vistaFacilityNames = ['VistA Site'];
      const { getAllByText, getByText } = render(
        <IntroSection
          dataSourceType="both"
          ohFacilityNamesBeforeCutover={ohFacilityNamesBeforeCutover}
          ohFacilityNamesAfterCutover={ohFacilityNamesAfterCutover}
          vistaFacilityNames={vistaFacilityNames}
        />,
      );

      // Oracle Health Site appears in both before and after lists
      expect(getAllByText(/Oracle Health Site/i).length).to.be.greaterThan(0);
      expect(getByText(/VistA Site/i)).to.exist;
    });

    it('renders explanation about CCD for OH facilities', () => {
      const ohFacilityNamesBeforeCutover = [
        'OH Facility (before January 1, 2022)',
      ];
      const ohFacilityNamesAfterCutover = [
        'OH Facility (January 1, 2022 - present)',
      ];
      const vistaFacilityNames = ['VistA Facility'];
      const { getByText } = render(
        <IntroSection
          dataSourceType="both"
          ohFacilityNamesBeforeCutover={ohFacilityNamesBeforeCutover}
          ohFacilityNamesAfterCutover={ohFacilityNamesAfterCutover}
          vistaFacilityNames={vistaFacilityNames}
        />,
      );

      // Should explain CCD is needed for OH facilities
      expect(getByText(/Continuity of Care Document/i)).to.exist;
    });

    it('renders facility names with cutover date suffixes', () => {
      const ohFacilityNamesBeforeCutover = [
        'VA Central Ohio health care (before April 30, 2022)',
      ];
      const ohFacilityNamesAfterCutover = [
        'VA Central Ohio health care (April 30, 2022 - present)',
      ];
      const vistaFacilityNames = ['VA Western New York health care'];
      const { getByText } = render(
        <IntroSection
          dataSourceType="both"
          ohFacilityNamesBeforeCutover={ohFacilityNamesBeforeCutover}
          ohFacilityNamesAfterCutover={ohFacilityNamesAfterCutover}
          vistaFacilityNames={vistaFacilityNames}
        />,
      );

      // Check that cutover date suffixes are rendered
      expect(getByText(/before April 30, 2022/i)).to.exist;
      expect(getByText(/April 30, 2022 - present/i)).to.exist;
    });
  });

  describe('LastUpdatedCard rendering', () => {
    it('renders LastUpdatedCard with lastSuccessfulUpdate prop', () => {
      const lastSuccessfulUpdate = {
        date: 'December 15, 2025',
        time: '3:45 p.m.',
      };
      const { container, getByText } = render(
        <IntroSection lastSuccessfulUpdate={lastSuccessfulUpdate} />,
      );

      // LastUpdatedCard renders a va-card element
      const vaCard = container.querySelector('va-card');
      expect(vaCard).to.exist;
      expect(getByText(/Records in these reports last updated/i)).to.exist;
      expect(getByText(/December 15, 2025/i)).to.exist;
    });

    it('does not render LastUpdatedCard when lastSuccessfulUpdate is null', () => {
      const { container } = render(
        <IntroSection lastSuccessfulUpdate={null} />,
      );

      // LastUpdatedCard should not render when null
      const vaCard = container.querySelector('va-card');
      expect(vaCard).to.not.exist;
    });
  });

  describe('HoldTimeInfo rendering', () => {
    it('renders HoldTimeInfo when showHoldTimeMessaging is true', () => {
      const { getByText } = render(<IntroSection showHoldTimeMessaging />);

      expect(getByText(/in your reports/i)).to.exist;
    });

    it('does not render HoldTimeInfo when showHoldTimeMessaging is false', () => {
      const { queryByText } = render(
        <IntroSection showHoldTimeMessaging={false} />,
      );

      expect(queryByText(/in your reports/i)).to.not.exist;
    });

    it('does not render HoldTimeInfo by default', () => {
      const { queryByText } = render(<IntroSection />);

      expect(queryByText(/in your reports/i)).to.not.exist;
    });
  });
});

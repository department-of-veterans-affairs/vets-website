import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { generateMedicationsPDF } from '../../../util/helpers';
import PrintDownload from '../../../components/shared/PrintDownload';
import prescription from '../../fixtures/prescriptionDetails.json';

describe('Medicaitons Print/Download button component', () => {
  const handleDownloadPDF = () => {
    generateMedicationsPDF(
      'medicalRecords',
      `${prescription.prescriptionName
        .replace(/\s/g, '_')
        .replace(/\//g, '-')}`,
      {
        headerBanner: [
          {
            text:
              'If you’re ever in crisis and need to talk with someone right away, call the Veterans Crisis line at 988. Then select 1.',
          },
        ],
        footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
        title: prescription?.prescriptionName,
        preface: 'This is a pdf of one of your prescriptions',
        results: {},
      },
    );
  };
  const setup = () => {
    return renderWithStoreAndRouter(
      <PrintDownload download={handleDownloadPDF} />,
      {
        path: '/',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
});

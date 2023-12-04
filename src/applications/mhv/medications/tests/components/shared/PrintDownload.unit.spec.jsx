import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
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
  const setup = (
    downloadPDF = handleDownloadPDF,
    success = false,
    list = false,
  ) => {
    return renderWithStoreAndRouter(
      <PrintDownload download={downloadPDF} isSuccess={success} list={list} />,
      {
        path: '/',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays error modal if error occurs ', async () => {
    const handleDownloadPDFError = () => {
      throw new Error('error');
    };
    const screen = setup(handleDownloadPDFError);
    const downloadButton = screen.getByText('Download this page as a PDF');
    fireEvent.click(downloadButton);

    const errorMessage = await screen.getByText(
      'We can’t access your medications right now',
    );
    expect(errorMessage).to.exist;
  });

  it('displays success message ', () => {
    const screen = setup(handleDownloadPDF, true);

    const sucessMessage = screen.getByText('Download complete');
    expect(sucessMessage).to.exist;
  });
  it('button displays different text for list', () => {
    const screen = setup(handleDownloadPDF, true, true);

    const sucessMessage = screen.getByText(
      'Download your medication list as a PDF',
    );
    expect(sucessMessage).to.exist;
  });
});

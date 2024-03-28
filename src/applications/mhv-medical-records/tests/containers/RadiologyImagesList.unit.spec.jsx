import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import RadiologyImagesList from '../../containers/RadiologyImagesList';
import user from '../fixtures/user.json';

describe('Radiology Images List container', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: {
          name: 'ANKLE LEFT 3 VIEWS',
          category: 'Radiology',
          orderedBy: 'Beth M. Smith',
          reason: 'Injury',
          clinicalHistory: 'Information',
          imagingProvider: 'John J. Lydon',
          id: 122,
          date: 'April 13, 2022, 5:25 a.m. MDT',
          imagingLocation:
            '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
          reactions: ['Just this one'],
          results:
            'This exam was performed at 673RD MED GRP, Elmendorf AFB. The report is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nImpression:\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nPrimary Diagnostic Code: BI-RADS CATEGORY 6 (Known Biopsy Proven Malignancy)\nSecondary Diagnostic Codes:\nBI-RADS CATEGORY 3 (Probably Benign)\nVERIFIED BY:\n/\n**********************\n*ELECTRONICALLY FILED*\n**********************\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nImpression:\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nPrimary Diagnostic Code: BI-RADS CATEGORY 6 (Known Biopsy Proven Malignancy)\nSecondary Diagnostic Codes:\nBI-RADS CATEGORY 3 (Probably Benign)\nVERIFIED BY:\n/\n**********************\n*ELECTRONICALLY FILED*\n**********************',
          images: [
            'image',
            'image',
            'image',
            'image',
            'image',
            'image',
            'image',
            'image',
            'image',
            'image',
          ],
        },
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<RadiologyImagesList />, {
      initialState: state,
      reducers: reducer,
      path: '/vaccine-details/123',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the test name as an h1', () => {
    const screen = setup();

    const testName = screen.getByText(
      `Images: ${initialState.mr.labsAndTests.labsAndTestsDetails.name}`,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(testName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText('April', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate.length).to.eq(2);
  });

  it('displays the images', () => {
    const screen = setup();
    const images = screen.getAllByTestId('image-div');
    expect(images.length).to.equal(5);
  });
});

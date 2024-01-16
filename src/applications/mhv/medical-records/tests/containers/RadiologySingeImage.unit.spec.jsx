import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import RadiologySingleImage from '../../containers/RadiologySingleImage';

describe('Radiology Single Image container', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: {
          name: 'ANKLE LEFT 3 VIEWS',
          category: 'Radiology',
          orderedBy: 'Beth M. Smith',
          orderingLocation:
            '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
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
    return renderWithStoreAndRouter(<RadiologySingleImage />, {
      initialState: state,
      reducers: reducer,
      path: '/labs-and-tests/radiology-images/122/2',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the image', () => {
    const screen = setup();
    const image = screen.getAllByTestId('image-div');
    expect(image).to.exist;
  });
});

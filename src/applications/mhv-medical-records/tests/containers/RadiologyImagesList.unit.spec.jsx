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
          orderedBy: 'DOE, JANE A',
          reason: 'Injury',
          clinicalHistory: 'Information',
          imagingProvider: 'John J. Lydon',
          id: 122,
          date: 'April 13, 2022, 5:25 a.m. MDT',
          imagingLocation:
            '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
          reactions: ['Just this one'],
          results: 'This exam was performed at 673RD MED GRP, Elmendorf AFB.',
          studyId: 12345,
          imageCount: 5,
        },
      },
      images: {
        imageList: [
          { index: 1, seriesAndImage: '01/01' },
          { index: 2, seriesAndImage: '02/01' },
          { index: 3, seriesAndImage: '03/01' },
          { index: 4, seriesAndImage: '04/01' },
          { index: 5, seriesAndImage: '05/01' },
        ],
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
    const formattedDate = screen.getByText('April', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the images', () => {
    const screen = setup();
    const images = screen.getAllByTestId('image-div');
    expect(images.length).to.equal(5);
  });
});

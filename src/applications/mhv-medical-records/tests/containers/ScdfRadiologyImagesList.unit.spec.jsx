import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history-v4';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import ScdfRadiologyImagesList from '../../containers/ScdfRadiologyImagesList';
import { ALERT_TYPE_IMAGE_THUMBNAIL_ERROR } from '../../util/constants';

const radiologyDetails = {
  name: 'ABDOMEN 2 + PA & LAT CHEST',
  date: 'December 5, 2024, 12:50 p.m. UTC',
  imageCount: 3,
  imagingStudyId: 'study-abc-123',
};

const thumbnailUrls = [
  'https://example.com/thumb1.jpg',
  'https://example.com/thumb2.jpg',
  'https://example.com/thumb3.jpg',
];

const initialState = {
  mr: {
    labsAndTests: {
      labsAndTestsDetails: radiologyDetails,
      labsAndTestsList: [radiologyDetails],
      scdfImageThumbnails: thumbnailUrls,
      scdfDicom: 'https://example.com/dicom.zip',
    },
    alerts: {
      alertList: [],
    },
  },
};

const pagePath = '/labs-and-tests/study-abc-123/images';

const setup = (state = initialState, history = null) =>
  renderWithStoreAndRouter(<ScdfRadiologyImagesList isTesting />, {
    initialState: state,
    reducers: reducer,
    history,
    path: pagePath,
  });

describe('ScdfRadiologyImagesList container', () => {
  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the test name with "Images:" prefix in h1', () => {
    const screen = setup();
    const heading = screen.getByText(`Images: ${radiologyDetails.name}`, {
      selector: 'h1',
    });
    expect(heading).to.exist;
  });

  it('displays the image count summary', () => {
    const screen = setup();
    const summary = screen.getByTestId('showing-image-records');
    expect(summary.textContent).to.include('Showing 1 to 3 of 3 images');
  });

  it('renders the correct number of image divs', () => {
    const screen = setup();
    const images = screen.getAllByTestId('image-div');
    expect(images.length).to.equal(3);
  });

  it('displays "Image X of Y" headings for each image', () => {
    const screen = setup();
    expect(screen.getByText('Image 1 of 3')).to.exist;
    expect(screen.getByText('Image 2 of 3')).to.exist;
    expect(screen.getByText('Image 3 of 3')).to.exist;
  });

  it('renders thumbnail images with correct alt text', () => {
    const screen = setup();
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).to.equal(3);
    expect(imgs[0].alt).to.equal('1, Details not provided');
    expect(imgs[1].alt).to.equal('2, Details not provided');
  });

  it('displays DICOM download section', () => {
    const screen = setup();
    expect(screen.getByText('How to share images with a non-VA provider')).to
      .exist;
    const dicomLink = screen.container.querySelector(
      'va-link[text="Download DICOM files"]',
    );
    expect(dicomLink).to.exist;
  });

  it('does not show DICOM download link when scdfDicom is null', () => {
    const noDicomState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          ...initialState.mr.labsAndTests,
          scdfDicom: null,
        },
      },
    };
    const screen = setup(noDicomState);
    const dicomLink = screen.container.querySelector(
      'va-link[text="Download DICOM files"]',
    );
    expect(dicomLink).to.not.exist;
  });

  it('shows loading indicator when data is not yet loaded', () => {
    const loadingState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: null,
          labsAndTestsList: [],
          scdfImageThumbnails: null,
          scdfDicom: null,
        },
        alerts: { alertList: [] },
      },
    };
    const screen = setup(loadingState);
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('shows loading indicator when thumbnails are not yet loaded', () => {
    const noThumbsState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          ...initialState.mr.labsAndTests,
          scdfImageThumbnails: null,
        },
      },
    };
    const screen = setup(noThumbsState);
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('uses singular "image" when there is only 1 thumbnail', () => {
    const singleImageState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          ...initialState.mr.labsAndTests,
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      },
    };
    const screen = setup(singleImageState);
    const summary = screen.getByTestId('showing-image-records');
    expect(summary.textContent).to.include('1 image');
    expect(summary.textContent).to.not.include('images');
  });

  it('does not render image gallery when thumbnails is empty array', () => {
    const emptyThumbsState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          ...initialState.mr.labsAndTests,
          scdfImageThumbnails: [],
        },
      },
    };
    const screen = setup(emptyThumbsState);
    expect(screen.queryByTestId('image-div')).to.not.exist;
    // Should still show the name without "Images:" prefix
    expect(screen.getByText(radiologyDetails.name, { selector: 'h1' })).to
      .exist;
  });

  it('redirects to details page when record has no imagingStudyId', async () => {
    const noStudyState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          ...initialState.mr.labsAndTests,
          labsAndTestsDetails: {
            ...radiologyDetails,
            imagingStudyId: undefined,
          },
        },
      },
    };
    const history = createMemoryHistory({
      initialEntries: [pagePath],
    });
    sinon.spy(history, 'push');

    setup(noStudyState, history);

    await waitFor(() => {
      expect(history.push.called).to.be.true;
    });
  });

  it('shows error alert instead of spinner when thumbnail fetch fails', () => {
    const errorState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyDetails,
          labsAndTestsList: [radiologyDetails],
          scdfImageThumbnails: null,
          scdfDicom: null,
        },
        alerts: {
          alertList: [
            {
              type: ALERT_TYPE_IMAGE_THUMBNAIL_ERROR,
              isActive: true,
              datestamp: Date.now(),
            },
          ],
        },
      },
    };
    const screen = setup(errorState);
    expect(screen.getByTestId('image-request-error-alert')).to.exist;
    expect(screen.queryByTestId('loading-indicator')).to.not.exist;
  });
});

import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach, it } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import RadiologyDetails from '../../components/LabsAndTests/RadiologyDetails';
import radiologyMhv from '../fixtures/radiologyMhv.json';
import radiologyMhvWithImages from '../fixtures/radiologyMhvWithImages.json';
import radiologyMhvWithImagesNew from '../fixtures/radiologyMhvWithImagesNew.json';
import radiologyMhvWithImageError from '../fixtures/radiologyMhvWithImageError.json';
import images from '../fixtures/images.json';
import threeImageRequestInProgress from '../fixtures/threeImageRequestInProgress.json';
import radiologyWithMissingFields from '../fixtures/radiologyWithMissingFields.json';
import {
  convertCvixRadiologyRecord,
  convertMhvRadiologyRecord,
} from '../../util/imagesUtil';

describe('RadiologyDetails component', () => {
  describe('images', () => {
    const radiologyRecord = convertCvixRadiologyRecord(radiologyMhvWithImages);
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyRecord,
        },
        images,
      },
    };

    let screen;
    beforeEach(() => {
      screen = renderWithStoreAndRouter(
        <RadiologyDetails
          record={radiologyRecord}
          fullState={initialState}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r5621490',
        },
      );
    });

    it('renders without errors', () => {
      expect(screen).to.exist;
    });

    it('should display the test name', () => {
      const header = screen.getByText('KNEE 4 OR MORE VIEWS (LEFT)', {
        exact: true,
        selector: 'h1',
      });
      expect(header).to.exist;
    });

    // This test will give different results when run in different time zones.
    it('should display the formatted date', () => {
      // Use regex to match the date format, ignoring the exact time which varies by timezone
      const formattedDate = screen.getByText(
        /April 4, 2024 \d{1,2}:\d{2} [ap]\.m\./,
        {
          selector: 'span',
        },
      );
      expect(formattedDate).to.exist;
    });

    it('should display the reason for the test', () => {
      expect(screen.getByTestId('radiology-reason')).to.contain.text(
        'Test data number2 Todd',
      );
    });

    it('should display the clinical history', () => {
      expect(screen.getByTestId('radiology-clinical-history')).to.contain.text(
        'None recorded',
      );
    });

    it('should display who the test was ordered by', () => {
      const orderedBy = screen.getByText('RODRIGUEZ,CARLOS', {
        exact: true,
        selector: 'p',
      });
      expect(orderedBy).to.exist;
    });

    it('should display the performing lab location', () => {
      const performingLocation = screen.getByText('IPO TEST 2', {
        exact: true,
        selector: 'p',
      });
      expect(performingLocation).to.exist;
    });

    it('should display the imaging provider', () => {
      expect(screen.getByTestId('radiology-imaging-provider')).to.contain.text(
        'None recorded',
      );
    });

    it('should display the lab results', () => {
      const results = screen.getByText(
        'Degenerative arthritis of left knee which has shown',
        {
          exact: false,
          selector: 'p',
        },
      );
      expect(results).to.exist;
    });

    it('should display a download started message when the download pdf button is clicked', () => {
      fireEvent.click(screen.getByTestId('printButton-1'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });

    it('should display a download started message when the download txt file button is clicked', () => {
      fireEvent.click(screen.getByTestId('printButton-2'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });
  });

  describe('image with error', () => {
    const radiologyRecord = convertCvixRadiologyRecord(
      radiologyMhvWithImageError,
    );
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyRecord,
        },
        images: {
          ...images,
          notificationStatus: true,
        },
      },
    };

    let screen;
    beforeEach(() => {
      screen = renderWithStoreAndRouter(
        <RadiologyDetails
          record={radiologyRecord}
          fullState={initialState}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r5621490',
        },
      );
    });

    it('renders without errors', () => {
      expect(screen).to.exist;
    });

    it('displays an error message', () => {
      const error = screen.getByText(
        'We’re sorry. There was a problem with our system. Try requesting your images again.',
        {
          exact: true,
          selector: 'p',
        },
      );
      expect(error).to.exist;

      const requestImagesButton = screen.getByTestId(
        'radiology-request-images-button',
      );
      expect(requestImagesButton).to.exist;
      // assert that the button is enabled:
      expect(requestImagesButton.getAttribute('disabled')).to.eq('false');
      fireEvent.click(requestImagesButton);
    });
  });

  describe('Radiology details component - new image', () => {
    const radiologyRecord = convertCvixRadiologyRecord(
      radiologyMhvWithImagesNew,
    );
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyRecord,
        },
        images: {
          ...images,
          notificationStatus: true,
        },
      },
    };

    let screen;
    beforeEach(() => {
      screen = renderWithStoreAndRouter(
        <RadiologyDetails
          record={radiologyRecord}
          fullState={initialState}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r5621490',
        },
      );
    });

    it('renders without errors', () => {
      expect(screen).to.exist;
    });
  });

  describe('baseline', () => {
    const radiologyRecord = convertMhvRadiologyRecord(radiologyMhv);
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyRecord,
        },
      },
    };

    let screen;
    beforeEach(() => {
      screen = renderWithStoreAndRouter(
        <RadiologyDetails
          record={radiologyRecord}
          fullState={initialState}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r5621490',
        },
      );
    });

    it('renders without errors', () => {
      expect(screen).to.exist;
    });

    it('should display the test name', () => {
      const header = screen.getByText('DEXA, PERIPHERAL STUDY', {
        exact: true,
        selector: 'h1',
      });
      expect(header).to.exist;
    });

    // This test will give different results when run in different time zones.
    it('should display the formatted date', () => {
      // Use regex to match the date format, ignoring the exact time which varies by timezone
      const formattedDate = screen.getByText(
        /January 6, 2004 \d{1,2}:\d{2} [ap]\.m\./,
        {
          selector: 'span',
        },
      );
      expect(formattedDate).to.exist;
    });

    it('should display the reason for the test', () => {
      const reason = screen.getByText('None recorded', {
        exact: true,
        selector: 'p',
      });
      expect(reason).to.exist;
    });

    it('should display the clinical history', () => {
      const clinicalHistory = screen.getByText('this is 71 yr old pt', {
        exact: false,
        selector: 'p',
      });
      expect(clinicalHistory).to.exist;
    });

    it('should display who the test was ordered by', () => {
      const orderedBy = screen.getByText('JOHN DOE', {
        exact: true,
        selector: 'p',
      });
      expect(orderedBy).to.exist;
    });

    it('should display the performing lab location', () => {
      const performingLocation = screen.getByText('DAYT3', {
        exact: true,
        selector: 'p',
      });
      expect(performingLocation).to.exist;
    });

    it('should display the imaging provider', () => {
      const imagingProvider = screen.getByText('JANE DOE', {
        exact: true,
        selector: 'p',
      });
      expect(imagingProvider).to.exist;
    });

    it('should display the lab results', () => {
      const results = screen.getByText('Osteopenia of the left forearm.', {
        exact: false,
        selector: 'p',
      });
      expect(results).to.exist;
    });

    it('should display a download started message when the download pdf button is clicked', () => {
      fireEvent.click(screen.getByTestId('printButton-1'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });

    it('should display a download started message when the download txt file button is clicked', () => {
      fireEvent.click(screen.getByTestId('printButton-2'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });
  });

  describe('with missing fields', () => {
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: convertMhvRadiologyRecord(
            radiologyWithMissingFields,
          ),
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <RadiologyDetails
        record={convertMhvRadiologyRecord(radiologyWithMissingFields)}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/123',
      },
    );

    it('should not display the date if date is missing', () => {
      waitFor(() => {
        expect(screen.queryByTestId('header-time').innerHTML).to.contain(
          'None recorded',
        );
      });
    });
  });

  describe('over request limit', () => {
    const radiologyRecord = convertCvixRadiologyRecord(radiologyMhvWithImages);
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: radiologyRecord,
        },
        images: {
          ...threeImageRequestInProgress,
          studyRequestLimitReached: true, // simulating request limit reached
        },
      },
    };

    let screen;
    beforeEach(() => {
      screen = renderWithStoreAndRouter(
        <RadiologyDetails
          record={radiologyRecord}
          fullState={initialState}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r5621490',
        },
      );
    });

    it('should display the over-request limit message', () => {
      const limitMessage = screen.getByText(
        'You can’t request images for this report right now. You can only have 3 image requests at a time.',
        {
          exact: false,
          selector: 'p',
        },
      );
      expect(limitMessage).to.exist;
    });

    it('should not display the request images button', () => {
      const requestButton = screen.queryByTestId(
        'radiology-request-images-button',
      );
      expect(requestButton).to.be.null;
    });
  });
});

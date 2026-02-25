import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import reducer from '../../reducers';
import UnifiedRadiologyDetails from '../../components/LabsAndTests/UnifiedRadiologyDetails';

const record = {
  name: 'ABDOMEN 2 + PA & LAT CHEST',
  date: 'December 5, 2024, 12:50 p.m. UTC',
  testCode: 'LP29684-5',
  testCodeDisplay: 'Radiology',
  sampleTested: 'Blood',
  bodySite: 'Abdomen',
  orderedBy: 'DOE, JANE',
  location: 'VA Medical Center',
  comments: ['Comment 1', 'Comment 2'],
  result: 'Normal',
  source: 'OH',
  imageCount: 3,
  imagingStudyId: 'study-abc-123',
};

const user = {
  userFullName: { first: 'John', last: 'Smith' },
  dob: '1974-04-06',
};

const setup = (stateOverrides = {}, recordOverrides = {}) => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: { ...record, ...recordOverrides },
        scdfImageThumbnails: undefined,
        scdfDicom: undefined,
        ...stateOverrides.labsAndTests,
      },
      images: {
        notificationStatus: null,
        ...stateOverrides.images,
      },
      alerts: {
        alertList: stateOverrides.alertList || [],
      },
    },
  };

  return renderWithStoreAndRouter(
    <UnifiedRadiologyDetails
      record={{ ...record, ...recordOverrides }}
      user={user}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/study-abc-123',
    },
  );
};

describe('UnifiedRadiologyDetails component', () => {
  describe('basic rendering', () => {
    let screen;
    beforeEach(() => {
      screen = setup({
        labsAndTests: {
          scdfImageThumbnails: [
            'https://example.com/thumb1.jpg',
            'https://example.com/thumb2.jpg',
            'https://example.com/thumb3.jpg',
          ],
        },
      });
    });

    it('renders without errors', () => {
      expect(screen).to.exist;
    });

    it('displays the test name as h1', () => {
      const header = screen.getByText('ABDOMEN 2 + PA & LAT CHEST', {
        exact: true,
        selector: 'h1',
      });
      expect(header).to.exist;
    });

    it('displays the test code', () => {
      expect(screen.getByTestId('radiology-test-code')).to.exist;
    });

    it('displays the body site when present', () => {
      expect(screen.getByTestId('radiology-body-site')).to.exist;
    });

    it('displays who ordered the test', () => {
      expect(screen.getByTestId('radiology-ordered-by')).to.exist;
    });

    it('displays the location', () => {
      expect(screen.getByTestId('radiology-collecting-location')).to.exist;
    });

    it('displays the results', () => {
      expect(screen.getByTestId('radiology-results')).to.exist;
    });
  });

  describe('Images section', () => {
    it('shows Images section when imageCount > 0', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      });
      const imagesHeader = screen.getByText('Images', { selector: 'h2' });
      expect(imagesHeader).to.exist;
    });

    it('does not show Images section when imageCount is 0', () => {
      const screen = setup({}, { imageCount: 0 });
      const imagesHeader = screen.queryByText('Images', { selector: 'h2' });
      expect(imagesHeader).to.not.exist;
    });

    it('shows loading spinner while thumbnails are loading', () => {
      const screen = setup();
      expect(screen.getByTestId('radiology-images-loading')).to.exist;
    });

    it('shows "View all N images" link when multiple thumbnails loaded', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: [
            'https://example.com/thumb1.jpg',
            'https://example.com/thumb2.jpg',
            'https://example.com/thumb3.jpg',
          ],
        },
      });
      const link = screen.getByTestId('radiology-view-all-images');
      expect(link).to.exist;
      expect(link.textContent).to.include('View all 3 images');
    });

    it('shows "View 1 image" without "all" for single thumbnail', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      });
      const link = screen.getByTestId('radiology-view-all-images');
      expect(link).to.exist;
      expect(link.textContent).to.include('View 1 image');
      expect(link.textContent).to.not.include('all');
    });

    it('shows error alert when ALERT_TYPE_IMAGE_THUMBNAIL_ERROR is active', async () => {
      const screen = setup({
        alertList: [
          {
            type: 'image thumbnail error',
            isActive: true,
            datestamp: Date.now(),
          },
        ],
      });
      await waitFor(() => {
        expect(screen.getByTestId('image-request-error-alert')).to.exist;
      });
    });

    it('does not show the view images link when error alert is active', async () => {
      const screen = setup({
        alertList: [
          {
            type: 'image thumbnail error',
            isActive: true,
            datestamp: Date.now(),
          },
        ],
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      });
      await waitFor(() => {
        expect(screen.queryByTestId('radiology-view-all-images')).to.not.exist;
      });
    });
  });

  describe('notification settings', () => {
    it('shows "Get email notifications" heading when notificationStatus is falsy', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
        images: { notificationStatus: null },
      });
      expect(
        screen.getByText('Get email notifications for images', {
          selector: 'h3',
        }),
      ).to.exist;
    });

    it('shows "Note:" text when notificationStatus is truthy', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
        images: { notificationStatus: true },
      });
      expect(screen.getByText('Note:', { exact: false })).to.exist;
    });

    it('shows notification settings link', () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      });
      const link = screen.container.querySelector(
        'va-link[text="Go to notification settings"]',
      );
      expect(link).to.exist;
    });
  });

  describe('body site conditional', () => {
    it('does not render body site field when bodySite is absent', () => {
      const screen = setup({}, { bodySite: undefined });
      expect(screen.queryByTestId('radiology-body-site')).to.not.exist;
    });

    it('uses "Site or sample tested" label when bodySite is absent', () => {
      const screen = setup({}, { bodySite: undefined });
      expect(screen.getByTestId('radiology-sample-tested')).to.exist;
    });
  });

  describe('polling behavior', () => {
    it('does not show spinner when thumbnails have already loaded', async () => {
      const screen = setup({
        labsAndTests: {
          scdfImageThumbnails: ['https://example.com/thumb1.jpg'],
        },
      });
      await waitFor(() => {
        expect(screen.queryByTestId('radiology-images-loading')).to.not.exist;
      });
    });
  });
});

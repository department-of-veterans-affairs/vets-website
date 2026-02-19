import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../../reducers';
import UnifiedRadiologyDetails from '../../../components/LabsAndTests/UnifiedRadiologyDetails';
import { uhdRecordSource, loincCodes } from '../../../util/constants';

describe('UnifiedRadiologyDetails component', () => {
  const mockUser = {
    userFullName: { first: 'John', last: 'Doe' },
    dob: '1980-01-01',
  };

  const mockVistaRecord = {
    id: 'r12345-abc',
    name: 'CHEST 2 VIEWS PA&LAT',
    date: 'January 15, 2025, 10:30 a.m.',
    reason: 'Routine checkup',
    clinicalHistory: 'No significant history',
    orderedBy: 'Dr. Smith',
    location: 'VA Medical Center',
    imagingLocation: 'VA Medical Center',
    imagingProvider: 'Dr. Johnson',
    result: 'Report:\n  Normal chest X-ray.\nImpression:\n  No acute findings.',
    results:
      'Report:\n  Normal chest X-ray.\nImpression:\n  No acute findings.',
    source: uhdRecordSource.VISTA,
    testCode: loincCodes.UHD_RADIOLOGY,
    studyId: 'urn:va:study:123',
    sortDate: '2025-01-15T10:30:00Z',
  };

  const mockOracleHealthRecord = {
    ...mockVistaRecord,
    id: 'r67890-def',
    source: uhdRecordSource.ORACLE_HEALTH,
    studyId: null,
  };

  const baseImages = {
    imageStatus: [],
    notificationStatus: false,
    studyRequestLimitReached: false,
    imageRequestApiFailed: false,
  };

  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockVistaRecord,
      },
      images: baseImages,
    },
  };

  describe('VistA radiology record', () => {
    it('renders without errors', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen).to.exist;
    });

    it('should display the test name', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-record-name')).to.have.text(
        'CHEST 2 VIEWS PA&LAT',
      );
    });

    it('should display the formatted date', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('header-time')).to.have.text(
        'January 15, 2025, 10:30 a.m.',
      );
    });

    it('should display the reason for the test', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-reason')).to.contain.text(
        'Routine checkup',
      );
    });

    it('should display the clinical history', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-clinical-history')).to.contain.text(
        'No significant history',
      );
    });

    it('should display who the test was ordered by', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-ordered-by')).to.contain.text(
        'Dr. Smith',
      );
    });

    it('should display the imaging location', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-imaging-location')).to.contain.text(
        'VA Medical Center',
      );
    });

    it('should display the imaging provider', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-imaging-provider')).to.contain.text(
        'Dr. Johnson',
      );
    });

    it('should display results', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-record-results')).to.contain.text(
        'Normal chest X-ray',
      );
    });

    it('should display Request Images button when studyId is present', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByTestId('radiology-request-images-button')).to.exist;
    });

    it('should display no images message when studyId is absent', () => {
      const recordNoStudy = {
        ...mockVistaRecord,
        studyId: null,
        imagingStudyId: null,
      };
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={recordNoStudy}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      expect(screen.getByText('There are no images attached to this report.'))
        .to.exist;
    });

    it('should display a download started message when the download pdf button is clicked', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      fireEvent.click(screen.getByTestId('printButton-1'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });

    it('should display a download started message when the download txt button is clicked', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockVistaRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState,
          reducers: reducer,
          path: '/labs-and-tests/r12345-abc',
        },
      );
      fireEvent.click(screen.getByTestId('printButton-2'));
      expect(screen.getByTestId('download-success-alert-message')).to.exist;
    });
  });

  describe('Oracle Health radiology record', () => {
    const ohInitialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: mockOracleHealthRecord,
        },
        images: baseImages,
      },
    };

    it('renders without errors', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockOracleHealthRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState: ohInitialState,
          reducers: reducer,
          path: '/labs-and-tests/r67890-def',
        },
      );
      expect(screen).to.exist;
    });

    it('should show the My VA Health link for Oracle Health source', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockOracleHealthRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState: ohInitialState,
          reducers: reducer,
          path: '/labs-and-tests/r67890-def',
        },
      );
      expect(screen.getByTestId('radiology-oracle-health-link')).to.exist;
    });

    it('should not show the Request Images button for Oracle Health source', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={mockOracleHealthRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState: ohInitialState,
          reducers: reducer,
          path: '/labs-and-tests/r67890-def',
        },
      );
      expect(screen.queryByTestId('radiology-request-images-button')).to.be
        .null;
    });
  });

  describe('missing fields', () => {
    const emptyRecord = {
      id: 'r99999-ghi',
      name: 'UNKNOWN RADIOLOGY TEST',
      date: 'February 1, 2025',
      source: uhdRecordSource.VISTA,
      testCode: loincCodes.UHD_RADIOLOGY,
    };

    it('renders with empty fields showing fallback text', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedRadiologyDetails
          record={emptyRecord}
          user={mockUser}
          runningUnitTest
        />,
        {
          initialState: {
            mr: {
              labsAndTests: { labsAndTestsDetails: emptyRecord },
              images: baseImages,
            },
          },
          reducers: reducer,
          path: '/labs-and-tests/r99999-ghi',
        },
      );
      expect(screen.getByTestId('radiology-record-name')).to.have.text(
        'UNKNOWN RADIOLOGY TEST',
      );
    });
  });
});

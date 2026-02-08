import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';

import UnifiedLabsAndTests from '../../../components/LabsAndTests/UnifiedLabAndTest';
import { uhdRecordSource, loincCodes } from '../../../util/constants';

describe('UnifiedLabsAndTests Component', () => {
  const mockRecord = {
    name: 'Test Name',
    date: '2025-04-21',
    testCode: '12345',
    sampleTested: 'Blood',
    bodySite: 'Arm',
    orderedBy: 'Dr. Smith',
    location: 'Lab A',
    comments: ['Comment 1', 'Comment 2'],
    result: 'Positive',
  };

  const mockUser = {
    userFullName: 'John Doe',
    dob: '1980-01-01',
  };
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockRecord,
      },
    },
  };

  it('renders the component with provided props -- all the properties -- no observations', () => {
    const screen = renderWithStoreAndRouter(
      <UnifiedLabsAndTests
        record={mockRecord}
        runningUnitTest
        user={mockUser}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/xyz-123?timeFrame=2024-04',
      },
    );
    expect(screen.getByTestId('lab-name')).to.have.text('Test Name');
    expect(screen.getByTestId('header-time')).to.have.text('2025-04-21');
    expect(screen.getByTestId('lab-and-test-code')).to.have.text('12345');
    expect(screen.getByTestId('lab-and-test-sample-tested')).to.have.text(
      'Blood',
    );
    expect(screen.getByTestId('lab-and-test-body-site')).to.have.text('Arm');
    expect(screen.getByTestId('lab-and-test-ordered-by')).to.have.text(
      'Dr. Smith',
    );
    expect(screen.getByTestId('lab-and-test-collecting-location')).to.have.text(
      'Lab A',
    );
    // tested differently since the items are displayed in a list
    expect(screen.getByTestId('lab-and-test-comments')).to.exist;
    expect(screen.getByTestId('lab-and-test-results')).to.have.text('Positive');
  });

  it('does not render the Results field when observations are present', () => {
    const screen = renderWithStoreAndRouter(
      <UnifiedLabsAndTests
        record={{
          ...mockRecord,
          observations: [
            {
              testCode: 'CHLORIDE',
              referenceRange: '98 - 107',
              status: 'final',
              comments: '',
              value: {
                text: '2 meq/L',
                type: 'Quantity',
              },
            },
          ],
        }}
        runningUnitTest
        user={mockUser}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    // Results field should not be present when observations exist
    expect(screen.queryByTestId('lab-and-test-results')).to.be.null;
  });

  it('renders the component with observations', () => {
    const screen = renderWithStoreAndRouter(
      <UnifiedLabsAndTests
        record={{
          ...mockRecord,
          observations: [
            {
              testCode: 'CHLORIDE',
              referenceRange: '98 - 107',
              status: 'final',
              comments: '',
              value: {
                text: '2 meq/L',
                type: 'Quantity',
              },
            },
            {
              testCode: 'SODIUM',
              referenceRange: '135 - 145',
              status: 'final',
              comments: '',
              value: {
                text: '140 meq/L',
                type: 'Quantity',
              },
            },
          ],
        }}
        runningUnitTest
        user={mockUser}
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    expect(screen.getByTestId('test-observations')).to.exist;
  });

  describe('link to My VA Health', () => {
    it('renders when source is Oracle Health and testCode is UHD radiology', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedLabsAndTests
          record={{
            ...mockRecord,
            source: uhdRecordSource.ORACLE_HEALTH,
            testCode: loincCodes.UHD_RADIOLOGY,
          }}
          runningUnitTest
          user={mockUser}
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      expect(screen.getByTestId('radiology-oracle-health-link')).to.exist;
    });

    it('does not render when only source matches', () => {
      // Only source matches
      const screen = renderWithStoreAndRouter(
        <UnifiedLabsAndTests
          record={{
            ...mockRecord,
            source: uhdRecordSource.ORACLE_HEALTH,
            testCode: 'NOT_RADIOLOGY',
          }}
          runningUnitTest
          user={mockUser}
        />,
        { initialState, reducers: reducer },
      );
      // Ensure link is absent when testCode does not match
      expect(screen.queryByTestId('radiology-oracle-health-link')).to.be.null;
    });

    it('does not render when only testCode matches', () => {
      // Only testCode matches
      const screen = renderWithStoreAndRouter(
        <UnifiedLabsAndTests
          record={{
            ...mockRecord,
            source: 'NON_OH_SOURCE',
            testCode: loincCodes.UHD_RADIOLOGY,
          }}
          runningUnitTest
          user={mockUser}
        />,
        { initialState, reducers: reducer },
      );
      // Ensure link is absent when source does not match
      expect(screen.queryByTestId('radiology-oracle-health-link')).to.be.null;
    });

    it('does not render when no conditions are met', () => {
      const screen = renderWithStoreAndRouter(
        <UnifiedLabsAndTests
          record={{ ...mockRecord }}
          runningUnitTest
          user={mockUser}
        />,
        { initialState, reducers: reducer },
      );
      expect(screen.queryByTestId('radiology-oracle-health-link')).to.be.null;
    });
  });
});

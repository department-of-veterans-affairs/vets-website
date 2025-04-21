import React from 'react';
import { expect } from 'chai';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';

import UnifiedLabsAndTests from '../../../components/LabsAndTests/UnifiedLabAndTest';

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
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
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
    screen.debug();
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
  // it('triggers PDF download when download button is clicked', () => {
  //   render(
  //     <UnifiedLabsAndTests
  //       record={mockRecord}
  //       user={mockUser}
  //       runningUnitTest
  //     />,
  //   );

  //   const downloadButton = screen.getByText('Download PDF');
  //   fireEvent.click(downloadButton);

  //   expect(screen.getByText('Download successful')).toBeInTheDocument();
  // });

  // it('triggers TXT download when download button is clicked', () => {
  //   render(
  //     <UnifiedLabsAndTests
  //       record={mockRecord}
  //       user={mockUser}
  //       runningUnitTest
  //     />,
  //   );

  //   const downloadButton = screen.getByText('Download TXT');
  //   fireEvent.click(downloadButton);

  //   expect(screen.getByText('Download successful')).toBeInTheDocument();
  // });

  // it('displays the correct date in the DateSubheading component', () => {
  //   render(
  //     <UnifiedLabsAndTests
  //       record={mockRecord}
  //       user={mockUser}
  //       runningUnitTest
  //     />,
  //   );

  //   expect(screen.getByText('2025-04-21')).toBeInTheDocument();
  // });

  // it('renders observations if present in the record', () => {
  //   render(
  //     <UnifiedLabsAndTests
  //       record={mockRecord}
  //       user={mockUser}
  //       runningUnitTest
  //     />,
  //   );

  //   expect(screen.getByText('Observation 1')).toBeInTheDocument();
  // });

  // it('does not render observations section if observations are not present', () => {
  //   const recordWithoutObservations = { ...mockRecord, observations: null };
  //   render(
  //     <UnifiedLabsAndTests
  //       record={recordWithoutObservations}
  //       user={mockUser}
  //       runningUnitTest
  //     />,
  //   );

  //   expect(screen.queryByText('Results')).not.toBeInTheDocument();
  // });
});

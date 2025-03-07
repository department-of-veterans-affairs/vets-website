import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import reducer from '../../reducers';
import user from '../fixtures/user.json';

import allergies from '../fixtures/allergies.json';
import labsAndTests from '../fixtures/labsAndTests.json';
import notes from '../fixtures/notes.json';
import vaccines from '../fixtures/vaccines.json';
import vitals from '../fixtures/vitals.json';
import conditions from '../fixtures/conditions.json';
import { convertAllergy } from '../../reducers/allergies';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';
import { convertVaccine } from '../../reducers/vaccines';
import { convertVital } from '../../reducers/vitals';
import { convertCondition } from '../../reducers/conditions';
import DownloadFileType from '../../components/DownloadRecords/DownloadFileType';

describe('DownloadFileType', () => {
  const initialState = {
    user,
    mr: {
      downloads: {
        dateFilter: {
          fromDate: '2024-09-13',
          option: '3',
          toDate: '2024-12-13',
        },
        generatingCCD: false,
        recordFilter: ['allergies', 'labTests', 'vaccines'],
      },
      allergies: {
        allergiesList: allergies.entry.map(item =>
          convertAllergy(item.resource),
        ),
      },
      labsAndTests: {
        labsAndTestsList: labsAndTests.entry.map(item =>
          convertLabsAndTestsRecord(item),
        ),
      },
      careSummariesAndNotes: {
        careSummariesAndNotesList: notes.entry.map(note =>
          convertCareSummariesAndNotesRecord(note.resource),
        ),
      },
      vaccines: {
        vaccinesList: vaccines.entry.map(vaccine =>
          convertVaccine(vaccine.resource),
        ),
      },
      vitals: {
        vitalsList: vitals.entry.map(item => convertVital(item.resource)),
      },
      conditions: {
        conditionsList: conditions.entry.map(condition =>
          convertCondition(condition),
        ),
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
  };
  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadFileType runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays a download button', async () => {
    await waitFor(() => {
      const downloadButton = screen.getByTestId('download-report-button');
      expect(downloadButton).to.exist;
    });
  });

  it('displays the number of records available', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('record-count').innerHTML).to.contain(
        '5 total records',
      );
    });
  });
});

describe('DownloadFileType with no records', () => {
  const initialState = {
    user,
    mr: {
      downloads: {
        dateFilter: {
          fromDate: '2024-09-13',
          option: '3',
          toDate: '2024-12-13',
        },
        generatingCCD: false,
        recordFilter: ['allergies', 'labTests', 'vaccines'],
      },
      allergies: {
        allergiesList: [],
      },
      labsAndTests: {
        labsAndTestsList: [],
      },
      careSummariesAndNotes: {
        careSummariesAndNotesList: [],
      },
      vaccines: {
        vaccinesList: [],
      },
      vitals: {
        vitalsList: [],
      },
      conditions: {
        conditionsList: [],
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
  };
  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadFileType runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('does not display a download button', async () => {
    await waitFor(() => {
      // assert that download button does not exist
      expect(screen.queryByTestId('download-report-button')).not.to.exist;
    });
  });

  it('displays an alert', async () => {
    await waitFor(() => {
      const alert = screen.queryByTestId('no-records-alert');
      expect(alert).to.have.attr('status', 'error');
      expect(alert).to.contain.text('No records found');
    });
  });
});

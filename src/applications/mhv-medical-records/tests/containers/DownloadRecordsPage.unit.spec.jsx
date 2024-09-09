import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import DownloadRecordsPage from '../../containers/DownloadRecordsPage';
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

describe('DownloadRecordsPage', () => {
  const initialState = {
    user,
    mr: {
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
        vaccinesList: vaccines.entry.map(vaccine => convertVaccine(vaccine)),
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
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadRecordsPage runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays sharing status', () => {
    expect(screen.getByText('Download all medical records')).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-pdf'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-txt'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('DownloadRecordsPage with connection error', () => {
  const initialState = {
    user,
    mr: {
      alerts: {
        alertList: [
          {
            datestamp: '2024-04-11T02:43:15.227Z',
            isActive: true,
            type: 'error',
          },
        ],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<DownloadRecordsPage runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download-all',
    });
  });

  it('should display an error message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-pdf'));
    waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });

  it('should display an error when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('download-blue-button-txt'));
    waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });
});

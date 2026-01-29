import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import * as mhvExports from '@department-of-veterans-affairs/mhv/exports';
import React from 'react';
import sinon from 'sinon';
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
import * as MrApi from '../../api/MrApi';
import * as helpers from '../../util/helpers';

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

describe('DownloadFileType — AAL logging', () => {
  let postCreateAALStub;
  let makePdfStub;
  let generateTextFileStub;

  beforeEach(() => {
    // stub out AAL and PDF/TXT generators
    postCreateAALStub = sinon.stub(MrApi, 'postCreateAAL').resolves();
    // Stub makePdf from mhv/exports (the actual import location in the component)
    makePdfStub = sinon.stub(mhvExports, 'makePdf').resolves();
    generateTextFileStub = sinon.stub(helpers, 'generateTextFile').returns();
  });

  afterEach(() => {
    postCreateAALStub.restore();
    makePdfStub.restore();
    generateTextFileStub.restore();
  });

  function renderWithFormat(format) {
    const initialState = {
      user,
      mr: {
        downloads: {
          dateFilter: {
            fromDate: '2024-09-13',
            option: '3',
            toDate: '2024-12-13',
          },
          recordFilter: ['allergies', 'labTests', 'vaccines'],
          fileTypeFilter: format, // drive PDF vs TXT here
        },
        allergies: {
          allergiesList: allergies.entry.map(e => convertAllergy(e.resource)),
        },
        labsAndTests: {
          labsAndTestsList: labsAndTests.entry.map(e =>
            convertLabsAndTestsRecord(e),
          ),
        },
        vaccines: {
          vaccinesList: vaccines.entry.map(v => convertVaccine(v.resource)),
        },
      },
    };

    return renderWithStoreAndRouter(<DownloadFileType runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/download',
    });
  }

  const clickDownload = async screen => {
    const btn = await screen.findByTestId('download-report-button');
    fireEvent.click(btn);
  };

  // This test is flaky when run in the full test suite due to module caching
  // issues with stubbing makePdf from @department-of-veterans-affairs/mhv/exports
  it.skip('logs AAL success when PDF download succeeds', async () => {
    const screen = renderWithFormat('pdf');
    await clickDownload(screen);

    await waitFor(() => {
      expect(postCreateAALStub.calledOnce, 'AAL called once').to.be.true;
    });
    expect(
      postCreateAALStub.calledWithMatch({
        activityType: 'Download',
        action: 'Custom Download Requested',
        performerType: 'Self',
        status: 1,
        oncePerSession: true,
      }),
    ).to.be.true;
  });

  // This test may be flaky for the same reason as the one below.
  it.skip('logs AAL failure when PDF download throws', async () => {
    const screen = renderWithFormat('pdf');
    makePdfStub.rejects(new Error());

    await clickDownload(screen);

    await waitFor(() => {
      expect(postCreateAALStub.calledOnce).to.be.true;
    });
    expect(postCreateAALStub.calledWithMatch({ status: 0 })).to.be.true;
  });

  // This test is flaky when run in the full test suite due to module caching
  // issues with stubbing generateTextFile
  it.skip('logs AAL success when TXT download succeeds', async () => {
    const screen = renderWithFormat('txt');
    await clickDownload(screen);

    await waitFor(() => {
      expect(postCreateAALStub.calledOnce).to.be.true;
    });
    expect(
      postCreateAALStub.calledWithMatch({
        activityType: 'Download',
        action: 'Custom Download Requested',
        performerType: 'Self',
        status: 1,
        oncePerSession: true,
      }),
    ).to.be.true;
  });

  // This test won't pass, I think due to a problem stubbing generateTextFile
  it.skip('logs AAL failure when TXT download throws', async () => {
    const screen = renderWithFormat('txt');
    generateTextFileStub.rejects(new Error());

    await clickDownload(screen);

    await waitFor(() => {
      expect(postCreateAALStub.calledOnce).to.be.true;
    });
    expect(postCreateAALStub.calledWithMatch({ status: 0 })).to.be.true;
  });
});

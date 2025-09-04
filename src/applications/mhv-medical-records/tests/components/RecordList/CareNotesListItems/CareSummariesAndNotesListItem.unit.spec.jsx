import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import CareSummariesAndNotesListItem from '../../../../components/RecordList/CareNotesListItems/CareSummariesAndNotesListItem';
import * as constants from '../../../../util/constants';

// Mock child components
const DischargeSummaryListItem = props => (
  <div data-testid="discharge-summary">
    DischargeSummary: {props.record?.id}
  </div>
);
const NoteListItem = props => (
  <div data-testid="note-list-item">Note: {props.record?.id}</div>
);

describe('CareSummariesAndNotesListItem (mocha)', () => {
  let dischargeStub;
  let noteStub;

  before(() => {
    dischargeStub = sinon
      .stub(
        require('../../../../components/RecordList/CareNotesListItems/DischargeSummaryListItem'),
        'default',
      )
      .callsFake(DischargeSummaryListItem);
    noteStub = sinon
      .stub(
        require('../../../../components/RecordList/CareNotesListItems/NoteListItem'),
        'default',
      )
      .callsFake(NoteListItem);
  });

  after(() => {
    dischargeStub.restore();
    noteStub.restore();
  });

  it('renders DischargeSummaryListItem when type is noteTypes.DISCHARGE_SUMMARY', () => {
    const record = { id: '1', type: constants.noteTypes.DISCHARGE_SUMMARY };
    const screen = render(<CareSummariesAndNotesListItem record={record} />);
    expect(screen.getByTestId('discharge-summary').textContent).to.contain(
      'DischargeSummary: 1',
    );
  });

  it('renders DischargeSummaryListItem when type is loincCodes.DISCHARGE_SUMMARY', () => {
    const record = { id: '2', type: constants.loincCodes.DISCHARGE_SUMMARY };
    const screen = render(<CareSummariesAndNotesListItem record={record} />);
    expect(screen.getByTestId('discharge-summary').textContent).to.contain(
      'DischargeSummary: 2',
    );
  });

  it('renders NoteListItem for other types', () => {
    const record = { id: '3', type: 'SOME_OTHER_TYPE' };
    const screen = render(<CareSummariesAndNotesListItem record={record} />);
    expect(screen.getByTestId('note-list-item').textContent).to.contain(
      'Note: 3',
    );
  });
});

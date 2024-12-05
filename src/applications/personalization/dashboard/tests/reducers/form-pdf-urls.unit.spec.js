import { expect } from 'chai';
import { reduceActions } from '../../../common/unitHelpers';
import {
  actionStart as start,
  actionSuccess as success,
  actionFail as fail,
} from '../../actions/form-pdf-url';
import { FETCH_FORM_STATUS_STARTED } from '../../actions/form-status';
import formPdfUrlsReducer from '../../reducers/form-pdf-urls';

const MOCK_GUID = 'mock-guid';
const MOCK_GUID2 = 'mock-guid2';
const MOCK_URL = 'http://www.example.submission.pdf';
const resetAction = () => ({ type: FETCH_FORM_STATUS_STARTED });

describe('form pdf urls reducer', () => {
  it('should toggle loading state', () => {
    const results = reduceActions([start(), success(), start(), fail()])(
      formPdfUrlsReducer,
    ).map(s => s.loading);
    expect(results).to.deep.equal([false, true, false, true, false]);
  });

  it('should store a map of submission guids to urls and errors', () => {
    const error = 'error';
    const results = reduceActions([
      success(MOCK_GUID, { url: MOCK_URL }),
      fail(MOCK_GUID2, error),
    ])(formPdfUrlsReducer)
      .slice(1)
      .map(s => s.submissions);
    expect(results).to.deep.equal([
      { [MOCK_GUID]: { url: MOCK_URL } },
      {
        [MOCK_GUID]: { url: MOCK_URL },
        [MOCK_GUID2]: { error },
      },
    ]);
  });

  it('should reset submissions state', () => {
    const results = reduceActions([
      start(MOCK_GUID),
      success(MOCK_GUID, { url: MOCK_URL }),
      resetAction(),
    ])(formPdfUrlsReducer)
      .slice(1)
      .map(s => s.submissions);
    expect(results).to.deep.equal([{}, { [MOCK_GUID]: { url: MOCK_URL } }, {}]);
  });

  it('clears guid submission state when request is started', () => {
    const results = reduceActions([
      start(MOCK_GUID),
      success(MOCK_GUID, { url: MOCK_URL }),
      start(MOCK_GUID),
    ])(formPdfUrlsReducer)
      .slice(1)
      .map(s => s.submissions);
    expect(results).to.deep.equal([{}, { [MOCK_GUID]: { url: MOCK_URL } }, {}]);
  });
});

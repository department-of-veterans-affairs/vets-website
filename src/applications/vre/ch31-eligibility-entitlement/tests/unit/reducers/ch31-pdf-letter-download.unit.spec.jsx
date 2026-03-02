import { expect } from 'chai';
import ch31PdfLetterDownload from '../../../reducers/ch31-pdf-letter-download';
import {
  CH31_PDF_LETTER_DOWNLOAD_STARTED,
  CH31_PDF_LETTER_DOWNLOAD_SUCCEEDED,
  CH31_PDF_LETTER_DOWNLOAD_FAILED,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_400_BAD_REQUEST,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_403_FORBIDDEN,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_503_UNAVAILABLE,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_500_SERVER,
} from '../../../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

describe('ch31PdfLetterDownload reducer', () => {
  it('returns initial state by default', () => {
    const next = ch31PdfLetterDownload(undefined, { type: '@@INIT' });
    expect(next).to.deep.equal(initialState);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_STARTED (sets loading true, clears error)', () => {
    const prev = { ...initialState, error: { status: 400, messages: ['x'] } };
    const next = ch31PdfLetterDownload(prev, {
      type: CH31_PDF_LETTER_DOWNLOAD_STARTED,
    });
    expect(next.loading).to.equal(true);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(prev.data);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_SUCCEEDED (stores payload, clears error, loading false)', () => {
    const payload = { resCaseId: 123 };
    const prev = {
      ...initialState,
      loading: true,
      error: { status: 500, messages: ['oops'] },
    };

    const next = ch31PdfLetterDownload(prev, {
      type: CH31_PDF_LETTER_DOWNLOAD_SUCCEEDED,
      payload,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(payload);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_ERROR_400_BAD_REQUEST', () => {
    const error = { status: 400, messages: ['Bad Request'] };
    const prev = { ...initialState, loading: true, data: { keep: 'me' } };

    const next = ch31PdfLetterDownload(prev, {
      type: CH31_PDF_LETTER_DOWNLOAD_ERROR_400_BAD_REQUEST,
      error,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
    expect(next.data).to.equal(prev.data);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_ERROR_403_FORBIDDEN', () => {
    const error = { status: 403, messages: ['Not Authorized'] };

    const next = ch31PdfLetterDownload(initialState, {
      type: CH31_PDF_LETTER_DOWNLOAD_ERROR_403_FORBIDDEN,
      error,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_ERROR_503_UNAVAILABLE', () => {
    const error = { status: 503, messages: ['Service Unavailable'] };

    const next = ch31PdfLetterDownload(initialState, {
      type: CH31_PDF_LETTER_DOWNLOAD_ERROR_503_UNAVAILABLE,
      error,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_ERROR_500_SERVER', () => {
    const error = { status: 500, messages: ['Server Error'] };

    const next = ch31PdfLetterDownload(initialState, {
      type: CH31_PDF_LETTER_DOWNLOAD_ERROR_500_SERVER,
      error,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_PDF_LETTER_DOWNLOAD_FAILED (generic failure)', () => {
    const error = { status: 418, messages: ['I’m a teapot'] };

    const next = ch31PdfLetterDownload(initialState, {
      type: CH31_PDF_LETTER_DOWNLOAD_FAILED,
      error,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('falls back to default error shape when action.error is missing', () => {
    const next = ch31PdfLetterDownload(initialState, {
      type: CH31_PDF_LETTER_DOWNLOAD_FAILED,
    });

    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal({
      status: null,
      messages: ['Unknown error'],
    });
  });

  it('is pure (does not mutate prior state)', () => {
    const prev = Object.freeze({ ...initialState });

    const next = ch31PdfLetterDownload(prev, {
      type: CH31_PDF_LETTER_DOWNLOAD_STARTED,
    });

    expect(next).to.not.equal(prev);
    expect(prev).to.deep.equal(initialState);
  });
});

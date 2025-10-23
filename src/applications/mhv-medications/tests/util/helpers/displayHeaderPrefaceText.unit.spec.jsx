import { expect } from 'chai';
import { displayHeaderPrefaceText } from '../../../util/helpers';
import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  rxListSortingOptions,
} from '../../../util/constants';

describe('displayHeaderPrefaceText function', () => {
  const rxListSize = 10;
  const sortKey = 'alphabeticallyByStatus';
  const sortLabelLower = rxListSortingOptions[sortKey].LABEL.toLowerCase();
  const sortedText = `sorted ${sortLabelLower}. `;
  const allRxNotIncludedText = `This list doesn't include all of your medications. `;
  const downloadRxText = `When you download medication records, we also include a list of allergies and reactions in your VA medical records.`;

  it('should display correct header preface text for ALL_MEDICATIONS_FILTER_KEY filter option in PDFs', () => {
    const parts = displayHeaderPrefaceText(
      ALL_MEDICATIONS_FILTER_KEY,
      sortKey,
      rxListSize,
    );

    expect(parts).to.be.an('array');

    const headerPrefaceText = parts.map(p => p.value).join('');
    const expected =
      `This is a list of all ${rxListSize} medications, ` +
      `${sortedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for ALL_MEDICATIONS_FILTER_KEY filter option in TXTs', () => {
    const headerPrefaceText = displayHeaderPrefaceText(
      ALL_MEDICATIONS_FILTER_KEY,
      sortKey,
      rxListSize,
      false,
    );

    expect(headerPrefaceText).to.be.a('string');

    const expected =
      `This is a list of all ${rxListSize} medications, ` +
      `${sortedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for ACTIVE_FILTER_KEY filter option in PDFs', () => {
    const parts = displayHeaderPrefaceText(
      ACTIVE_FILTER_KEY,
      sortKey,
      rxListSize,
    );

    expect(parts).to.be.an('array');

    const headerPrefaceText = parts.map(p => p.value).join('');
    const expected =
      `This is a filtered list of ${rxListSize} active medications: active prescriptions and non-VA medications, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for ACTIVE_FILTER_KEY filter option in TXTs', () => {
    const headerPrefaceText = displayHeaderPrefaceText(
      ACTIVE_FILTER_KEY,
      sortKey,
      rxListSize,
      false,
    );

    expect(headerPrefaceText).to.be.a('string');

    const expected =
      `This is a filtered list of ${rxListSize} active medications: active prescriptions and non-VA medications, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for RECENTLY_REQUESTED_FILTER_KEY filter option in PDFs', () => {
    const parts = displayHeaderPrefaceText(
      RECENTLY_REQUESTED_FILTER_KEY,
      sortKey,
      rxListSize,
    );

    expect(parts).to.be.an('array');

    const headerPrefaceText = parts.map(p => p.value).join('');
    const expected =
      `This is a filtered list of ${rxListSize} recently requested medications: refill requests in process or shipped in the last 15 days, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for RECENTLY_REQUESTED_FILTER_KEY filter option in TXTs', () => {
    const headerPrefaceText = displayHeaderPrefaceText(
      RECENTLY_REQUESTED_FILTER_KEY,
      sortKey,
      rxListSize,
      false,
    );

    expect(headerPrefaceText).to.be.a('string');

    const expected =
      `This is a filtered list of ${rxListSize} recently requested medications: refill requests in process or shipped in the last 15 days, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for RENEWAL_FILTER_KEY filter option in PDFs', () => {
    const parts = displayHeaderPrefaceText(
      RENEWAL_FILTER_KEY,
      sortKey,
      rxListSize,
    );

    expect(parts).to.be.an('array');

    const headerPrefaceText = parts.map(p => p.value).join('');
    const expected =
      `This is a filtered list of ${rxListSize} medications that need renewal before refill: prescriptions that just ran out of refills or became too old to refill (expired), ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for RENEWAL_FILTER_KEY filter option in TXTs', () => {
    const headerPrefaceText = displayHeaderPrefaceText(
      RENEWAL_FILTER_KEY,
      sortKey,
      rxListSize,
      false,
    );

    expect(headerPrefaceText).to.be.a('string');

    const expected =
      `This is a filtered list of ${rxListSize} medications that need renewal before refill: prescriptions that just ran out of refills or became too old to refill (expired), ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for NON_ACTIVE_FILTER_KEY filter option in PDFs', () => {
    const parts = displayHeaderPrefaceText(
      NON_ACTIVE_FILTER_KEY,
      sortKey,
      rxListSize,
    );

    expect(parts).to.be.an('array');

    const headerPrefaceText = parts.map(p => p.value).join('');
    const expected =
      `This is a filtered list of ${rxListSize} non-active medications: prescriptions that are discontinued, expired, or have an unknown status, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should display correct header preface text for NON_ACTIVE_FILTER_KEY filter option in TXTs', () => {
    const headerPrefaceText = displayHeaderPrefaceText(
      NON_ACTIVE_FILTER_KEY,
      sortKey,
      rxListSize,
      false,
    );

    expect(headerPrefaceText).to.be.a('string');

    const expected =
      `This is a filtered list of ${rxListSize} non-active medications: prescriptions that are discontinued, expired, or have an unknown status, ` +
      `${sortedText}` +
      `${allRxNotIncludedText}` +
      `${downloadRxText}`;

    expect(headerPrefaceText).to.equal(expected);
  });

  it('should throw an error for an unknown filter option', () => {
    expect(() =>
      displayHeaderPrefaceText('__NOT_A_FILTER__', sortKey, rxListSize),
    ).to.throw('Unknown filter option: __NOT_A_FILTER__');
  });
});

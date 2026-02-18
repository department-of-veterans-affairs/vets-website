import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import * as redactPiiModule from 'platform/utilities/data/redactPii';
import * as apiModule from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';

describe('Result component - redactPii usage', () => {
  let sandbox;
  let recordEventStub;
  let redactPiiStub;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEventStub = sandbox.stub(recordEventModule, 'default');
    redactPiiStub = sandbox.stub(redactPiiModule, 'default');
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    sandbox.stub(Sentry, 'captureException');
    sandbox.stub(Sentry, 'captureMessage');
    redactPiiStub.returns('[REDACTED]');

    delete window.location;
    window.location = {
      href: 'https://www.va.gov/search',
      pathname: '/search',
    };
    window.history.replaceState = sandbox.spy();

    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0',
    });

    apiRequestStub.resolves({});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call redactPii with query when recording search result click event', () => {
    const query = 'john@example.com';
    const searchData = {
      currentPage: 1,
      recommendedResults: [],
      totalEntries: 10,
    };

    recordEventModule.default({
      event: 'onsite-search-results-click',
      'search-page-path': window.location.pathname,
      'search-query': redactPiiModule.default(query), // This is line 68
      'search-result-chosen-page-url': 'https://www.va.gov/test',
      'search-result-chosen-title': 'Test Result',
      'search-results-n-current-page': searchData.currentPage,
      'search-results-position': 1,
      'search-results-total-count': searchData.totalEntries,
      'search-results-total-pages': Math.ceil(searchData.totalEntries / 10),
      'search-results-top-recommendation': false,
      'search-result-type': 'title',
      'search-selection': 'All VA.gov',
      'search-typeahead-used': false,
    });

    expect(redactPiiStub.calledOnce).to.be.true;
    expect(redactPiiStub.calledWith(query)).to.be.true;
    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
      '[REDACTED]',
    );
  });

  it('should call redactPii with query containing email PII when recording event', () => {
    const query = 'Contact me at test@example.com';

    recordEventModule.default({
      event: 'onsite-search-results-click',
      'search-page-path': '/search',
      'search-query': redactPiiModule.default(query),
    });

    expect(redactPiiStub.calledOnce).to.be.true;
    expect(redactPiiStub.calledWith(query)).to.be.true;
    expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
      '[REDACTED]',
    );
  });

  it('should call redactPii with query containing phone PII when recording event', () => {
    const query = 'Call 555-123-4567 for help';

    recordEventModule.default({
      event: 'onsite-search-results-click',
      'search-page-path': '/search',
      'search-query': redactPiiModule.default(query),
    });

    expect(redactPiiStub.calledOnce).to.be.true;
    expect(redactPiiStub.calledWith(query)).to.be.true;
    expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
      '[REDACTED]',
    );
  });

  it('should call redactPii with query containing SSN PII when recording event', () => {
    const query = 'My SSN is 123-45-6789';

    recordEventModule.default({
      event: 'onsite-search-results-click',
      'search-page-path': '/search',
      'search-query': redactPiiModule.default(query),
    });

    expect(redactPiiStub.calledOnce).to.be.true;
    expect(redactPiiStub.calledWith(query)).to.be.true;
    expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
      '[REDACTED]',
    );
  });

  it('should call redactPii with query containing multiple PII types when recording event', () => {
    const query =
      'Contact john@example.com at 123 Main St or call 555-123-4567';

    recordEventModule.default({
      event: 'onsite-search-results-click',
      'search-page-path': '/search',
      'search-query': redactPiiModule.default(query),
    });

    expect(redactPiiStub.calledOnce).to.be.true;
    expect(redactPiiStub.calledWith(query)).to.be.true;
    expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
      '[REDACTED]',
    );
  });
});

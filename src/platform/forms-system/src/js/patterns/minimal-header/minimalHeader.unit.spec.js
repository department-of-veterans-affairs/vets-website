import { expect } from 'chai';
import sinon from 'sinon';
import { afterEach } from 'mocha';
import { isMinimalHeaderApp, isMinimalHeaderPath } from '.';

describe('isMinimalHeaderApp and isMinimalHeaderPath', () => {
  afterEach(() => {
    sessionStorage.removeItem('MINIMAL_HEADER_APPLICABLE');
    sessionStorage.removeItem('MINIMAL_HEADER_EXCLUDE_PATHS');
  });

  it('sessionStorage should not be populated with minimal header values - this indicates a test sessionStorage leak', () => {
    const minimalHeaderValue = sessionStorage.getItem(
      'MINIMAL_HEADER_APPLICABLE',
    );
    const minimalHeaderExcludePathsValue = sessionStorage.getItem(
      'MINIMAL_HEADER_EXCLUDE_PATHS',
    );

    expect(minimalHeaderValue).to.eql(null);
    expect(minimalHeaderExcludePathsValue).to.eql(null);
  });

  it('should return a boolean if minimal header is applicable', () => {
    expect(isMinimalHeaderApp()).to.eql(false);
    expect(isMinimalHeaderPath()).to.eql(false);
    sessionStorage.setItem('MINIMAL_HEADER_APPLICABLE', 'true');
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(true);
  });

  it('should not be applicable on excluded paths', () => {
    const locationStub = sinon.stub(window, 'location');
    sessionStorage.setItem('MINIMAL_HEADER_APPLICABLE', 'true');
    sessionStorage.setItem(
      'MINIMAL_HEADER_EXCLUDE_PATHS',
      '["/introduction","/confirmation"]',
    );

    locationStub.value({
      pathname: '/introduction',
    });
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(false);

    locationStub.value({
      pathname: '/middle-of-form',
    });
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(true);

    locationStub.restore();
  });
});

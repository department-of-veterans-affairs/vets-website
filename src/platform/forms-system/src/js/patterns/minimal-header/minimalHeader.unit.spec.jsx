import { expect } from 'chai';
import sinon from 'sinon';
import { afterEach } from 'mocha';
import { cleanup } from '@testing-library/react';
import { isMinimalHeaderApp, isMinimalHeaderPath } from '.';

describe('isMinimalHeaderApp and isMinimalHeaderPath', () => {
  let minimalHeader;

  afterEach(() => {
    if (minimalHeader) {
      document.body.removeChild(minimalHeader);
      minimalHeader = null;
    }
    cleanup();
  });

  it('should return a boolean true if minimal header is applicable', () => {
    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    document.body.appendChild(minimalHeader);
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(true);
  });

  it('should return a boolean false by default if no minimal header minimalHeader', () => {
    expect(isMinimalHeaderApp()).to.eql(false);
    expect(isMinimalHeaderPath()).to.eql(false);
  });

  it('should not be applicable on excluded paths', () => {
    const locationStub = sinon.stub(window, 'location');

    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    minimalHeader.setAttribute(
      'data-exclude-paths',
      '["/introduction","/confirmation"]',
    );
    document.body.appendChild(minimalHeader);

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

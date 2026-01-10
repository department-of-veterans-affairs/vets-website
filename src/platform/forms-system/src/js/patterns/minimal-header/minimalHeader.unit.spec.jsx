import { expect } from 'chai';
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
    // Save original pathname
    const originalPathname = window.location.pathname;

    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    minimalHeader.setAttribute(
      'data-exclude-paths',
      '["/introduction","/confirmation"]',
    );
    document.body.appendChild(minimalHeader);

    // Use history API to change pathname (JSDOM 22+ compatible)
    window.history.replaceState({}, '', '/introduction');
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(false);

    window.history.replaceState({}, '', '/middle-of-form');
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(true);

    // Restore original pathname
    window.history.replaceState({}, '', originalPathname || '/');
  });
});

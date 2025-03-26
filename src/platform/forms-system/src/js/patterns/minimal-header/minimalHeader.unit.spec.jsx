import { expect } from 'chai';
import sinon from 'sinon';
import { afterEach } from 'mocha';
import { cleanup } from '@testing-library/react';
import { isMinimalHeaderApp, isMinimalHeaderPath } from '.';

describe('isMinimalHeaderApp and isMinimalHeaderPath', () => {
  let dom;

  afterEach(() => {
    cleanup();
    dom = null;
  });

  it('should return a boolean true if minimal header is applicable', () => {
    dom = document.createElement('div');
    dom.innerHTML += `
      <div id="header-minimal">
        Minimal header
      </div>
    `;
    document.body.appendChild(dom);
    expect(isMinimalHeaderApp()).to.eql(true);
    expect(isMinimalHeaderPath()).to.eql(true);
  });

  it('should return a boolean false by default if no minimal header dom', () => {
    expect(isMinimalHeaderApp()).to.eql(false);
    expect(isMinimalHeaderPath()).to.eql(false);
  });

  it('should not be applicable on excluded paths', () => {
    const locationStub = sinon.stub(window, 'location');

    dom = document.createElement('div');
    dom.innerHTML += `
      <div id="header-minimal" data-exclude-paths="[&quot;/introduction&quot;,&quot;/confirmation&quot;]">
        Minimal header
      </div>
    `;
    document.body.appendChild(dom);

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

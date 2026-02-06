import { expect } from 'chai';
import sinon from 'sinon';

import {
  base64ToPdfObjectUrl,
  buildPdfObjectUrls,
  revokeObjectUrls,
} from './avs';

describe('VAOS Utils: AVS', () => {
  let sandbox;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;
  let originalAtob;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    originalAtob = global.atob;
  });

  afterEach(() => {
    // Restore potential globals if replaced
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    if (originalAtob) {
      global.atob = originalAtob;
    } else {
      delete global.atob;
    }
    sandbox.restore();
  });

  it('base64ToPdfObjectUrl returns object URL for valid base64 decode', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL').returns('blob:ok');

    global.atob = sandbox.stub().returns('%PDF-1.4\nMOCK');

    // Act
    const url = base64ToPdfObjectUrl('JVBERi0xLjQK');

    // Assert
    expect(url).to.equal('blob:ok');
    expect(createStub.calledOnce).to.be.true;
  });

  it('base64ToPdfObjectUrl returns null when decode fails', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL');
    global.atob = sandbox.stub().throws(new Error('bad base64'));

    // Act
    const url = base64ToPdfObjectUrl('not-base64');

    // Assert
    expect(url).to.equal(null);
    expect(createStub.called).to.be.false;
  });

  it('buildPdfObjectUrls maps files to object URLs', () => {
    // Arrange
    const createStub = sandbox.stub(URL, 'createObjectURL');
    createStub.onFirstCall().returns('blob:a');
    createStub.onSecondCall().returns('blob:b');
    global.atob = sandbox.stub().returns('%PDF-1.4\nMOCK');
    const files = [
      { binary: 'AAA', contentType: 'application/pdf' },
      { binary: 'BBB', contentType: 'application/pdf' },
    ];

    // Act
    const urls = buildPdfObjectUrls(files);

    // Assert
    expect(urls).to.deep.equal(['blob:a', 'blob:b']);
    expect(createStub.callCount).to.equal(2);
  });

  it('revokeObjectUrls revokes only truthy URLs', () => {
    // Arrange
    const revokeStub = sandbox.stub(URL, 'revokeObjectURL');
    const urls = ['blob:1', null, undefined, ''];

    // Act
    revokeObjectUrls(urls);

    // Assert
    expect(revokeStub.callCount).to.equal(1);
    expect(revokeStub.calledWith('blob:1')).to.be.true;
  });
});

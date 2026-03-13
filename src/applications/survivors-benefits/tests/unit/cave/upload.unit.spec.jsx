import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { uploadDocument } from '../../../cave/upload';

// FormData.append requires a Blob — use real File objects
const makePdfFile = (name = 'test.pdf') =>
  new File(['%PDF-1.4'], name, { type: 'application/pdf' });

const makeJpegFile = () =>
  new File(['data'], 'photo.jpg', { type: 'image/jpeg' });

describe('cave/upload — uploadDocument', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(api, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('throws for a non-PDF file type', async () => {
    let error;
    try {
      await uploadDocument(makeJpegFile());
    } catch (e) {
      error = e;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.include('Unsupported file type');
  });

  it('accepts a file whose name ends with .pdf regardless of MIME type', async () => {
    apiRequestStub.resolves({ id: 'doc-1', bucket: 'b', pdfKey: 'k' });
    const file = new File(['data'], 'upload.pdf', {
      type: 'application/octet-stream',
    });
    const result = await uploadDocument(file);
    expect(result.id).to.equal('doc-1');
  });

  it('calls apiRequest with POST method', async () => {
    apiRequestStub.resolves({ id: 'doc-1', bucket: 'b', pdfKey: 'k' });
    await uploadDocument(makePdfFile());
    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.firstCall.args[1].method).to.equal('POST');
  });

  it('returns { id, bucket, pdfKey } on success', async () => {
    apiRequestStub.resolves({
      id: 'doc-1',
      bucket: 'my-bucket',
      pdfKey: 'path/key',
    });
    const result = await uploadDocument(makePdfFile());
    expect(result).to.deep.equal({
      id: 'doc-1',
      bucket: 'my-bucket',
      pdfKey: 'path/key',
    });
  });

  it('throws a wrapped error when apiRequest rejects', async () => {
    apiRequestStub.rejects({ status: 500, message: 'Server error' });
    let error;
    try {
      await uploadDocument(makePdfFile());
    } catch (e) {
      error = e;
    }
    expect(error.message).to.include('CAVE intake failed');
    expect(error.message).to.include('500');
  });

  it('throws when the response has no id', async () => {
    apiRequestStub.resolves({ bucket: 'b', pdfKey: 'k' });
    let error;
    try {
      await uploadDocument(makePdfFile());
    } catch (e) {
      error = e;
    }
    expect(error.message).to.include('no document id');
  });
});

import { expect } from 'chai';
import sinon from 'sinon';

import { addFile } from '../../../components/DocumentUploader/addFile';

describe('addFile', () => {
  it('should add an error message for invalid/unsupported file types', () => {
    const file = { name: 'test.zip' };
    const setState = sinon.spy();
    addFile(file, {}, setState);

    expect(setState.called).to.be.true;
    expect(setState.args[0][0].errorMessage).to.contain(
      'from one of the accepted file types',
    );
    expect(setState.args[0][0].submissionPending).to.be.false;
  });
  it('should add a supported file type', () => {
    const file = { name: 'test.pdf' };
    const setState = sinon.spy();
    const state = {
      documentType: 'something',
      files: [],
      reader: {
        readAsDataURL: sinon.spy(),
        result: '1234',
      },
      onloadend: null,
    };
    addFile(file, state, setState);

    expect(setState.notCalled).to.be.true;
    expect(state.reader.readAsDataURL.called).to.be.true;
    expect(state.reader.readAsDataURL.args[0][0].name).to.eq(file.name);
    expect(state.reader.onloadend).to.not.be.null;

    state.reader.onloadend(); // usually executed as file upload callback
    expect(setState.called).to.be.true;

    expect(setState.args[0][0].files[0]).to.deep.equal({
      file: '1234',
      documentType: 'something',
      fileType: 'pdf',
      fileName: 'test.pdf',
    });
  });
  it('should use document description for "other" document type', () => {
    const file = { name: 'test.pdf' };
    const setState = sinon.spy();
    const state = {
      documentType: 'Other',
      documentDescription: 'description',
      files: [],
      reader: {
        readAsDataURL: sinon.spy(),
        result: '1234',
      },
      onloadend: null,
    };
    addFile(file, state, setState);

    expect(setState.notCalled).to.be.true;
    expect(state.reader.readAsDataURL.called).to.be.true;
    expect(state.reader.readAsDataURL.args[0][0].name).to.eq(file.name);
    expect(state.reader.onloadend).to.not.be.null;

    state.reader.onloadend(); // usually executed as file upload callback
    expect(setState.called).to.be.true;

    expect(setState.args[0][0].files[0]).to.deep.equal({
      file: '1234',
      documentType: 'description',
      fileType: 'pdf',
      fileName: 'test.pdf',
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';

import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import { submitToAPI } from '../../../components/DocumentUploader/submit';

// LGY swagger docs via Citrix:
// https://int.services.lgy.va.gov/eligibility-manager/swagger-ui/index.html?configUrl=/eligibility-manager/v3/api-docs/swagger-config
const okMockResponse = {
  id: 123,
  documentType: 'Something',
  createDate: '2022-09-01T00:00:00.000Z',
  description: 'some image',
  mimeTypes: '.png',
};

const failedMockResponse = {
  timestamp: 0,
  status: 0,
  lgyRequestUuid: '123456-abcd',
  errors: [
    {
      message: 'Nope',
      rejectedValue: 'oops',
      field: 'name',
    },
  ],
};

const initialState = {
  files: [
    {
      fileName: 'image.png',
      documentType: 'Something',
      description: 'some image',
      contentBase64: '093abc',
    },
  ],
  submitted: [],
};

describe('submitToAPI', () => {
  it('should upload selected file', done => {
    const setState = sinon.spy();

    resetFetch();
    mockApiRequest(okMockResponse);
    submitToAPI(initialState, setState);

    expect(setState.called).to.be.true;
    const response1 = setState.firstCall.args[0];
    expect(response1.files.length).to.eq(1);
    expect(response1.submissionPending).to.be.true;

    setTimeout(() => {
      const response2 = setState.secondCall.args[0];
      expect(response2.files.length).to.eq(0);
      expect(response2.submitted.length).to.eq(1);
      expect(response2.errorMessage).to.be.null;
      expect(response2.successMessage).to.be.true;
      expect(response2.submissionPending).to.be.false;
      done();
    });
  });
  it('should return error with failed upload', done => {
    const setState = sinon.spy();

    resetFetch();
    mockApiRequest(failedMockResponse);
    submitToAPI(initialState, setState);

    expect(setState.called).to.be.true;
    const response1 = setState.firstCall.args[0];
    expect(response1.files.length).to.eq(1);
    expect(response1.submissionPending).to.be.true;

    setTimeout(() => {
      const response2 = setState.secondCall.args[0];
      expect(response2.files.length).to.eq(1);
      expect(response2.errorMessage).to.contain('Try again later');
      expect(response2.successMessage).to.be.undefined;
      expect(response2.submissionPending).to.be.false;
      done();
    });
  });

  it('should show an error message when there are no files to upload', () => {
    const setState = sinon.spy();
    submitToAPI({ files: [] }, setState);

    expect(setState.called).to.be.true;
    expect(setState.args[0][0].errorMessage).to.contain('Choose a file');
  });
});

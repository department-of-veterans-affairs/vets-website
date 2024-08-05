import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import {
  createPayload,
  parseResponse,
  setPlannedClinics,
} from '../../../../utils/helpers/form-config';

describe('CG `createPayload` method', () => {
  let mockFile;
  let formId;

  beforeEach(() => {
    mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    formId = '1234';
  });

  it('should create a FormData instance with form_id and file', () => {
    const payload = createPayload(mockFile, formId);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('attachment[file_data]')).to.equal(mockFile);
    expect(payload.get('attachment[password]')).to.be.null;
  });

  it('should append password to FormData if provided', () => {
    const password = 'password';
    const payload = createPayload(mockFile, formId, password);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('attachment[file_data]')).to.equal(mockFile);
    expect(payload.get('attachment[password]')).to.equal(password);
  });
});

describe('CG `parseResponse` method', () => {
  const response = {
    data: {
      attributes: {
        guid: 'test-guid',
      },
      id: 'test-id',
    },
  };
  let recordEventStub;
  let mockFile;
  let mockResult;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
    mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    mockResult = parseResponse(response, mockFile);
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should return an object with the name, confirmation code and guid', () => {
    expect(mockResult).to.deep.equal({
      name: 'test.txt',
      confirmationCode: 'test-id',
      guid: 'test-guid',
    });
  });

  it('should call the `recordEvent` helper to send event to Google Analytics', () => {
    expect(
      recordEventStub.calledWith({
        'caregivers-poa-document-guid': 'test-guid',
        'caregivers-poa-document-confirmation-code': 'test-id',
      }),
    ).to.be.true;
  });
});

describe('CG `setPlannedClinics` method', () => {
  it('should set an empty array if no state is set', () => {
    const result = setPlannedClinics({});
    expect(result.enum).to.be.empty;
  });

  it('should set an empty array if selected state does not have an available clinic', () => {
    const result = setPlannedClinics({ 'view:plannedClinicState': 'AS' });
    expect(result.enum).to.be.empty;
  });

  it('should populate the array with clinics when available', () => {
    const result = setPlannedClinics({ 'view:plannedClinicState': 'IN' });
    expect(result.enum).to.not.be.empty;
  });
});

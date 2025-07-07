import { expect } from 'chai';
import { uploadPage, warningsPresent } from '../../../pages/upload';
import { createPayload, parseResponse } from '../../../helpers';

describe('uploadPage', () => {
  const { uiSchema } = uploadPage;

  it('defines a uiSchema and schema', () => {
    expect(uploadPage).to.have.property('schema');
    expect(uploadPage).to.have.property('uiSchema');
  });

  it('updates the title when there are no warnings', () => {
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema({});
    expect(result).to.deep.equal({
      'ui:title': 'Select a file to upload',
    });
  });

  it('updates the title when uploadedFile has warnings', () => {
    const formData = {
      uploadedFile: {
        warnings: ['bad news'],
      },
    };
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema(formData);
    expect(result).to.deep.equal({
      'ui:title': 'Select a file to upload',
    });
  });

  it('updates the title when supportingDocuments have warnings', () => {
    const formData = {
      supportingDocuments: [{ warnings: ['bad doc'] }],
    };
    const result = uiSchema.uploadedFile['ui:options'].updateUiSchema(formData);
    expect(result).to.deep.equal({
      'ui:title': 'Select a file to upload',
    });
  });

  it('calls ui:description function and returns a React element', () => {
    const props = {
      formData: {},
    };
    const desc = uiSchema['ui:description'](props);
    expect(desc).to.exist;
  });
});

describe('warningsPresent', () => {
  it('returns false if no warnings', () => {
    expect(warningsPresent({})).to.be.false;
  });

  it('returns true if uploadedFile has warnings', () => {
    const formData = {
      uploadedFile: { warnings: ['bad'] },
    };
    expect(warningsPresent(formData)).to.be.true;
  });

  it('returns true if supportingDocuments have warnings', () => {
    const formData = {
      supportingDocuments: [{ warnings: ['bad'] }],
    };
    expect(warningsPresent(formData)).to.be.true;
  });
});

describe('createPayload', () => {
  it('creates payload with formId and file', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const payload = createPayload(file, 'form-id');
    expect(payload.get('form_id')).to.equal('form-id');
    expect(payload.get('file')).to.equal(file);
  });

  it('creates payload with password if provided', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const payload = createPayload(file, 'form-id', 'secret');
    expect(payload.get('password')).to.equal('secret');
  });
});

describe('parseResponse', () => {
  it('parses API response', () => {
    const resp = {
      data: {
        attributes: {
          name: 'test.pdf',
          size: 123,
          confirmationCode: 'abc123',
        },
      },
    };
    const result = parseResponse(resp);
    expect(result).to.deep.equal({
      name: 'test.pdf',
      size: 123,
      confirmationCode: 'abc123',
    });
  });
});

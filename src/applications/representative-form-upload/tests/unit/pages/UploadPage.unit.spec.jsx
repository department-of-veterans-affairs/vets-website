import { expect } from 'chai';
import { uploadPage, warningsPresent } from '../../../pages/upload';
import { createPayload, parseResponse } from '../../../helpers';

describe('uploadPage', () => {
  const { uiSchema, schema } = uploadPage;

  it('defines a uiSchema and schema', () => {
    expect(uploadPage).to.have.property('schema');
    expect(uploadPage).to.have.property('uiSchema');
  });

  it('calls ui:description function and returns a React element', () => {
    const props = { formData: {} };
    const desc = uiSchema['ui:description'](props);
    expect(desc).to.exist;
  });

  describe('uploadedFile', () => {
    const { uploadedFile } = uiSchema;

    it('has maxFileSize of 25MB', () => {
      expect(uploadedFile['ui:options'].maxFileSize).to.equal(26214400);
    });

    it('updates the title when no warnings', () => {
      const result = uploadedFile['ui:options'].updateUiSchema({});
      expect(result).to.deep.equal({
        'ui:title': 'Select a file to upload',
      });
    });

    it('updates the title when uploadedFile has warnings', () => {
      const formData = {
        uploadedFile: {
          warnings: ['bad'],
        },
      };
      const result = uploadedFile['ui:options'].updateUiSchema(formData);
      expect(result).to.deep.equal({
        'ui:title': 'Select a file to upload',
      });
    });

    it('updates the title when supportingDocuments have warnings', () => {
      const formData = {
        supportingDocuments: [{ warnings: ['bad doc'] }],
      };
      const result = uploadedFile['ui:options'].updateUiSchema(formData);
      expect(result).to.deep.equal({
        'ui:title': 'Select a file to upload',
      });
    });
  });

  describe('supportingDocuments', () => {
    it('has a ui:field and ui:options for supportingDocuments', () => {
      const sd = uiSchema.supportingDocuments;
      expect(sd['ui:options']).to.be.an('object');
    });

    it('loads description for supporting documents', () => {
      const title = uiSchema['view:supportingEvidenceDescription'];
      expect(title).to.be.an('object');
    });

    it('has a custom ui:title React element', () => {
      const title = uiSchema['view:supportingEvidenceTitle'];
      expect(title).to.be.an('object');
    });
  });

  describe('schema', () => {
    it('defines expected required field', () => {
      expect(schema.required).to.include('uploadedFile');
    });

    it('defines schema for supportingDocuments', () => {
      const props = schema.properties.supportingDocuments.items.properties;
      expect(props).to.have.all.keys(
        'additionalData',
        'confirmationCode',
        'name',
        'size',
        'type',
        'warnings',
      );
    });
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

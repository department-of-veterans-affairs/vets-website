import { expect } from 'chai';
import sinon from 'sinon';
// import { focusElement } from 'platform/utilities/ui';
import { createPayload, dependentsUploadUI } from '../../config/upload';

describe('createPayload', () => {
  it('should create a FormData object with file and form_id', () => {
    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const formId = '1234';
    const payload = createPayload(file, formId);

    expect(payload.get('file')).to.equal(file);
    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('password')).to.be.null;
  });

  it('should include password when provided', () => {
    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const formId = '1234';
    const password = 'mypassword';
    const payload = createPayload(file, formId, password);

    expect(payload.get('file')).to.equal(file);
    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('password')).to.equal(password);
  });
});

describe('findAndFocusLastSelect', () => {
  let mockFocusElement;
  beforeEach(() => {
    mockFocusElement = sinon.spy();
  });

  it('should not call focusElement if no select exists', () => {
    document.body.innerHTML = '';
    const schema = dependentsUploadUI({ buttonText: 'Upload file' });
    schema['ui:options']?.parseResponse({}, {});
    expect(mockFocusElement.called).to.be.false;
  });
});

import { expect } from 'chai';
import * as sinon from 'sinon';
import validatePdfPassword from 'platform/forms-system/src/js/utilities/file/validatePdfPassword';

describe('validatePdfPassword', () => {
  let mockFile;
  let mockPdfjs;

  beforeEach(() => {
    mockFile = {
      arrayBuffer: sinon.stub().resolves(new ArrayBuffer(1024)),
    };
    mockPdfjs = { getDocument: sinon.stub() };
  });

  afterEach(() => {
    if (typeof sinon.restore === 'function') {
      sinon.restore();
    }
  });

  it('should return invalid if file or password is missing', async () => {
    const result = await validatePdfPassword(null, 'password');
    expect(result).to.deep.equal({ valid: false, error: 'Password required' });
    const result2 = await validatePdfPassword(mockFile, '');
    expect(result2).to.deep.equal({ valid: false, error: 'Password required' });
  });

  it('should gracefully skip when pdfjs not available (skipImport)', async () => {
    const result = await validatePdfPassword(mockFile, 'password', {
      skipImport: true,
    });
    expect(result).to.deep.equal({ valid: true, skipped: true });
  });

  it('should return valid for correct password', async () => {
    const mockPdfDoc = {
      getPage: sinon.stub().resolves({}),
      destroy: sinon.stub(),
    };
    const mockLoadingTask = { promise: Promise.resolve(mockPdfDoc) };
    mockPdfjs.getDocument.returns(mockLoadingTask);
    const result = await validatePdfPassword(mockFile, 'correct-password', {
      pdfjs: mockPdfjs,
    });
    expect(result).to.deep.equal({ valid: true });
    expect(mockPdfDoc.destroy.calledOnce).to.be.true;
  });

  it('should return invalid for incorrect password', async () => {
    const passwordError = new Error('Invalid password');
    passwordError.name = 'PasswordException';
    const mockLoadingTask = { promise: Promise.reject(passwordError) };
    mockPdfjs.getDocument.returns(mockLoadingTask);
    const result = await validatePdfPassword(mockFile, 'wrong-password', {
      pdfjs: mockPdfjs,
    });
    expect(result).to.deep.equal({
      valid: false,
      error: 'Incorrect password',
    });
  });

  it('should return valid and skip for other PDF errors', async () => {
    const genericError = new Error('Corrupted PDF');
    const mockLoadingTask = { promise: Promise.reject(genericError) };
    mockPdfjs.getDocument.returns(mockLoadingTask);
    const result = await validatePdfPassword(mockFile, 'password', {
      pdfjs: mockPdfjs,
    });
    expect(result).to.deep.equal({ valid: true, skipped: true });
  });

  it('should detect password errors by message content', async () => {
    const passwordError = new Error('password is required');
    const mockLoadingTask = { promise: Promise.reject(passwordError) };
    mockPdfjs.getDocument.returns(mockLoadingTask);
    const result = await validatePdfPassword(mockFile, 'wrong-password', {
      pdfjs: mockPdfjs,
    });
    expect(result).to.deep.equal({
      valid: false,
      error: 'Incorrect password',
    });
  });
});

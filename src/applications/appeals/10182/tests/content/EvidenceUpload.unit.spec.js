import { expect } from 'chai';

import { fileTypes } from '../../content/EvidenceUpload';

describe('fileTypes', () => {
  it('should return default PDF type', () => {
    expect(fileTypes()).to.eq('.pdf');
  });
  it('should return multiple extension types', () => {
    expect(fileTypes(['pdf', 'png'])).to.eq('.pdf or .png');
    expect(fileTypes(['pdf', 'png', 'jpg'])).to.eq('.pdf, .png, or .jpg');
    expect(fileTypes(['pdf', 'png', 'jpg', 'txt'])).to.eq(
      '.pdf, .png, .jpg, or .txt',
    );
  });
});

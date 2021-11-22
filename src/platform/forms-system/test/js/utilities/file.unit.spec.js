import { expect } from 'chai';

import { checkForEncryptedPdf } from 'platform/forms-system/src/js/utilities/file';

describe('checkForEncryptedPdf', () => {
  let oldFileReader;

  const setup = (isEncrypted, ext = 'pdf') => {
    oldFileReader = global.FileReader;
    global.FileReader = function() {
      this.readAsArrayBuffer = () => {};

      const result = isEncrypted
        ? [0, 0, ...'/Encrypt'.split('').map(s => s.charCodeAt(0)), 0, 0]
        : new Array(20).fill(0);

      const onloadendEvent = {
        target: {
          readyState: 'done',
          result,
        },
      };

      setTimeout(() => {
        this.onloadend(onloadendEvent);
      }, 100);
    };
    global.FileReader.DONE = 'done';
    return {
      name: `some-${isEncrypted ? '' : 'un'}encrypted-file.${ext}`,
      slice: () => {},
    };
  };

  after(() => {
    global.FileReader = oldFileReader;
  });

  it('should ignore all files with feature flag off', done => {
    const file = setup(false, 'pdf');
    checkForEncryptedPdf(file).then(result => {
      expect(result).to.be.false;
      done();
    });
  });
  it('should ignore all files with uiSchema option disabled', done => {
    const file = setup(false, 'pdf');
    checkForEncryptedPdf(file).then(result => {
      expect(result).to.be.false;
      done();
    });
  });
  it('should ignore non-PDf files', done => {
    const file = setup(false, 'png');
    checkForEncryptedPdf(file).then(result => {
      expect(result).to.be.false;
      done();
    });
  });

  it('should resolve with false for unencrypted files', done => {
    const file = setup(false);
    checkForEncryptedPdf(file).then(result => {
      expect(result).to.be.false;
      done();
    });
  });
  it('should resolve with true for encrypted files', done => {
    const file = setup(true);
    checkForEncryptedPdf(file).then(result => {
      expect(result).to.be.true;
      done();
    });
  });
});

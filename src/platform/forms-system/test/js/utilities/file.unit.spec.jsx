import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  arrayIncludesArray,
  fileTypeSignatures,
  checkIsEncryptedPdf,
  ShowPdfPassword,
} from 'platform/forms-system/src/js/utilities/file';

const arrayFromString = str => [...str].map(s => s.charCodeAt(0));

const arrayOfZeros = new Array(20).fill(0);
const encryptedMockFile = [
  ...arrayOfZeros,
  ...arrayFromString('/Encrypt'),
  ...arrayOfZeros,
];

describe('readAndCheckFile', () => {
  let oldFileReader;

  before(() => {
    oldFileReader = global.FileReader;
  });

  after(() => {
    global.FileReader = oldFileReader;
  });

  const setup = async (ext = 'pdf', isEncrypted) => {
    const fileType = fileTypeSignatures[ext] || {};

    const result = [
      ...arrayOfZeros,
      ...Array.from(
        new Uint8Array(
          Array.isArray(fileType.sig)
            ? fileType.sig
            : [...fileType.sig].map(s => s.charCodeAt(0)),
        ),
      ),
      ...(isEncrypted ? encryptedMockFile : []),
    ];

    global.FileReader = async () => {
      this.readAsArrayBuffer = () => {};

      const onloadendEvent = {
        target: {
          readyState: 'done',
          result,
        },
      };

      await this.onloadend(onloadendEvent);
    };
    global.FileReader.DONE = 'done';

    return {
      name: `some-file.${ext}`,
      type: fileType.mime,
      slice: () => result,
    };
  };

  it('should resolve if no checks are included', async () => {
    const file = await setup('pdf');
    await waitFor(() => {
      readAndCheckFile(file, {}).then(result => {
        expect(result).to.be.empty;
      });
    });
  });

  describe('checkTypeAndExtensionMatches', () => {
    const checks = { checkTypeAndExtensionMatches };

    it('should return true for string signature checks (pdf)', async () => {
      const file = await setup('pdf');
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkTypeAndExtensionMatches).to.be.true;
        });
      });
    });
    it('should return true for name with extra periods (pdf)', async () => {
      const file = await { name: 'some.file.test.pdf', ...setup('pdf') };
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkTypeAndExtensionMatches).to.be.true;
        });
      });
    });
    it('should return true for string with only an extension (pdf)', async () => {
      const file = await { name: '.pdf', ...setup('pdf') };
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkTypeAndExtensionMatches).to.be.true;
        });
      });
    });
    it('should return true for array signature checks (doc)', async () => {
      const file = await setup('doc');
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkTypeAndExtensionMatches).to.be.true;
        });
      });
    });
    it('should return true for escaped string signature checks (rtf)', async () => {
      const file = await setup('rtf');
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkTypeAndExtensionMatches).to.be.true;
        });
      });
    });
  });

  describe('checkIsEncryptedPdf', () => {
    const checks = { checkIsEncryptedPdf };

    it('should ignore all files with feature flag off', async () => {
      const file = await setup('pdf', false);
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkIsEncryptedPdf).to.be.false;
        });
      });
    });
    it('should ignore all files with uiSchema option disabled', async () => {
      const file = await setup('pdf', false);
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkIsEncryptedPdf).to.be.false;
        });
      });
    });
    it('should ignore non-PDf files', async () => {
      const file = await setup('png', false);
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkIsEncryptedPdf).to.be.false;
        });
      });
    });

    it('should resolve with false for unencrypted files', async () => {
      const file = await setup('pdf', false);
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkIsEncryptedPdf).to.be.false;
        });
      });
    });
    it('should resolve with true for encrypted files', async () => {
      const file = await setup('pdf', true);
      await waitFor(() => {
        readAndCheckFile(file, checks).then(result => {
          expect(result.checkIsEncryptedPdf).to.be.true;
        });
      });
    });
  });
});

describe('checkIsEncryptedPdf', () => {
  const file = { name: 'some-file.PDF' };
  it('should return false for non-PDF files', () => {
    expect(
      checkIsEncryptedPdf({ file: { name: 'foo.jpg' }, result: arrayOfZeros }),
    ).to.be.false;
  });
  it('should return false if encrypted signature not found', () => {
    expect(checkIsEncryptedPdf({ file, result: arrayOfZeros })).to.be.false;
  });
  it('should return true for encrypted PDFs', () => {
    expect(checkIsEncryptedPdf({ file, result: encryptedMockFile })).to.be.true;
  });
});

describe('checkTypeAndExtensionMatches', () => {
  const getFile = ({
    name = 'foo.gif',
    type = fileTypeSignatures.gif.mime,
    result = [...arrayOfZeros, ...fileTypeSignatures.gif.sig, ...arrayOfZeros],
  } = {}) => ({ file: { name, type }, result });

  it('should return false for un-supported extensions', () => {
    const file = getFile({ name: 'foo.unknown' });
    expect(checkTypeAndExtensionMatches(file)).to.be.false;
  });
  it('should return false for mismatch of the extension & mime', () => {
    const file = getFile({ type: 'image/bmp' });
    expect(checkTypeAndExtensionMatches(file)).to.be.false;
  });
  it('should return false for signature mismatch', () => {
    const file = getFile({ result: arrayFromString('123_GIF7a_456') });
    expect(checkTypeAndExtensionMatches(file)).to.be.false;
  });
  it('should return true for files with matching extension, mime & signature', () => {
    const file = getFile();
    expect(checkTypeAndExtensionMatches(file)).to.be.true;
  });
  it('should return true for jpg files with jpg type3 signature', () => {
    const file = getFile({
      name: 'foo.jpg',
      type: fileTypeSignatures.jpeg.mime,
      result: [...fileTypeSignatures.jpeg.sigs.jpgType3, ...arrayOfZeros],
    });
    expect(checkTypeAndExtensionMatches(file)).to.be.true;
  });
  it('should return true for jpeg files with lots of leading zeros', () => {
    const file = getFile({
      name: 'foo.jpeg',
      type: fileTypeSignatures.jpeg.mime,
      result: [
        ...arrayOfZeros,
        ...fileTypeSignatures.jpeg.sigs.jpgType2, // starts with 3 zeros
        ...arrayOfZeros,
      ],
    });
    expect(checkTypeAndExtensionMatches(file)).to.be.true;
  });
  it('should return true for jpeg files with jpg signature', () => {
    const file = getFile({
      name: 'foo.jpeg',
      type: fileTypeSignatures.jpeg.mime,
      result: [...fileTypeSignatures.jpeg.sigs.jpgType4, ...arrayOfZeros],
    });
    expect(checkTypeAndExtensionMatches(file)).to.be.true;
  });
  it('should return true for text files with txt extension and no signature', () => {
    const file = getFile({
      name: 'valid.txt',
      size: 95,
      type: fileTypeSignatures.txt.mime,
    });
    expect(checkTypeAndExtensionMatches(file)).to.be.true;
  });
});

describe('arrayIncludesArray', () => {
  it('should return false for non-arrays', () => {
    expect(arrayIncludesArray({}, [2, 3])).to.be.false;
    expect(arrayIncludesArray(['0', '1'], {})).to.be.false;
    expect(arrayIncludesArray('test', [2, 3])).to.be.false;
    expect(arrayIncludesArray([2, 3], 'test')).to.be.false;
    expect(arrayIncludesArray('test', [2, 3])).to.be.false;
  });
  it('should return false for empty arrays', () => {
    expect(arrayIncludesArray([], [2, 3])).to.be.false;
    expect(arrayIncludesArray(['0', '1'], [])).to.be.false;
  });

  it('should return false for no match', () => {
    expect(arrayIncludesArray([1], [2])).to.be.false;
    expect(arrayIncludesArray([0, 1, 2, 0], [2, 3])).to.be.false;
    expect(
      arrayIncludesArray(['0', '1', '2', '0', '1', '2', '3', '4', '3'], [2, 3]),
    ).to.be.false;
    expect(arrayIncludesArray([1, 2, 3, 4, 6, 7, 8, 9], [5])).to.be.false;
    expect(arrayIncludesArray([1, 2, 3], [2, 3, 4])).to.be.false;
    expect(arrayIncludesArray([3, 2, 1], [1, 2])).to.be.false;
  });
  it('should return true for a matching nested array', () => {
    expect(arrayIncludesArray([1], [1])).to.be.true;
    expect(arrayIncludesArray([0, 1, 2, 3, 4], [2, 3])).to.be.true;
    expect(arrayIncludesArray(['0', '1', '2', '3', '4'], ['2', '3'])).to.be
      .true;
    expect(arrayIncludesArray([1, 2, 3, 4, 6, 7, 8, 9], [8])).to.be.true;
    expect(
      arrayIncludesArray(
        [0, 0, 0, ...arrayFromString('12345'), 0, 0, 0],
        arrayFromString('234'),
      ),
    ).to.be.true;
    expect(
      arrayIncludesArray(['0', '1', '2', '0', '1', '2', '3', '4', '3'], [2, 3]),
    ).to.be.false;
  });
});

describe('ShowPdfPassword', () => {
  const buttonClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });
  const getProps = (onSubmitPassword = () => {}) => ({
    file: { name: 'foo' },
    index: 0,
    onSubmitPassword,
  });

  it('should render', () => {
    const props = getProps();
    const { container } = render(<ShowPdfPassword {...props} />);

    expect($('va-text-input', container)).to.exist;
    expect($('va-button', container)).to.exist;
    expect($('va-text-input[uswds]', container)).to.exist;
    expect($('va-button[uswds]', container)).to.exist;
  });
  it('should show validation error', () => {
    const props = getProps();
    const { container } = render(<ShowPdfPassword {...props} />);
    fireEvent.click($('va-button', container), buttonClick);

    expect($('va-text-input', container)).to.have.attr(
      'error',
      'Please provide a password to decrypt this file',
    );
  });
  it('should call onSubmitPassword', () => {
    const submitSpy = sinon.spy();
    const props = getProps(submitSpy);
    const { container } = render(<ShowPdfPassword {...props} testVal="1234" />);

    fireEvent.click($('va-button', container), buttonClick);

    expect($('va-text-input', container)).to.not.have.attr('error');
    expect(props.onSubmitPassword.calledOnce).to.be.true;
    expect(props.onSubmitPassword.args[0]).to.deep.equal([
      { name: 'foo' },
      0,
      '1234',
    ]);
  });
});

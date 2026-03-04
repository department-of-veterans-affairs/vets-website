import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { introductionPageFlow } from 'applications/simple-forms/shared/tests/e2e/helpers';
import {
  createTestConfig,
  makeMinimalPNG,
  makeInvalidUtf8File,
  makeMinimalTxtFile,
  makeMinimalJPG,
  makeMinimalPDF,
  makeEncryptedPDF,
  makeNotAcceptedFile,
} from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockFileUpload from '../../../shared/tests/e2e/fixtures/mocks/file-input.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const SELECTOR = 'root_wcv3FileInputMultiple';

/**
 * test that a file is added and uploaded
 * @param {Function} - a function that returns a file of any type
 */
function testFileUpload(files) {
  cy.fillVaFileInputMultiple(SELECTOR, {}, files);
}

function deleteFile() {
  cy.deleteVaFileInputMultiple();
}

// test adding a variety of file types
function testFileUploads() {
  const funcs = [
    makeMinimalJPG,
    makeMinimalPNG,
    makeMinimalPDF,
    makeMinimalTxtFile,
  ];
  cy.wrap(Promise.all(funcs.map(async func => func()))).then(files => {
    testFileUpload(files);
  });
  for (let i = 0; i < funcs.length; i++) {
    deleteFile();
  }
}

// test that a file with an invalid mimetype results in an error state
function testRejectInvalidMimeType() {
  cy.wrap(makeMinimalPNG()).then(file => {
    const moddedFile = new File([file], 'placeholder.zip', { type: file.type });
    cy.fillVaFileInputMultiple(SELECTOR, {}, [moddedFile]);
    cy.expectVaFileInputMultipleErrorMimeTypeMismatch();
    deleteFile();
  });
}

// test that a file has proper utf8 encoding
function testInvalidUTF8Encoding() {
  const invalidFile = makeInvalidUtf8File();
  cy.fillVaFileInputMultiple(SELECTOR, {}, [invalidFile]);
  cy.expectVaFileInputMultipleErrorInvalidEncoding();
  deleteFile();
}

// test that a file whose size exceeds limit results in an error
function testTooBig() {
  const tooBigFile = makeMinimalTxtFile(100);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [tooBigFile]);
  cy.expectVaFileInputMultipleErrorTooBig();
  deleteFile();
}

// test that a file whose size is less than a limit results in an error
function testTooSmall() {
  const tooSmallFile = makeMinimalTxtFile(1);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [tooSmallFile]);
  cy.expectVaFileInputMultipleErrorTooSmall();
  deleteFile();
}

// test that a zero byte file upload results in an error
function testZeroBytes() {
  const zeroFile = makeMinimalTxtFile(0);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [zeroFile]);
  cy.expectVaFileInputMultipleErrorEmpty();
  deleteFile();
}

// test all file size limit scenarios
function testFileSizeLimits() {
  testTooBig();
  testTooSmall();
  testZeroBytes();
}

// test that encrypted pdfs require passwords
function testEncryptedPdf() {
  cy.wrap(makeEncryptedPDF()).then(file => {
    cy.fillAndUnlockEncryptedPdfVaFileInputMultiple(
      SELECTOR,
      file,
      'testpassword',
    );
  });
  deleteFile();
}

// test files of a type not specified by accept result in an error
function testRejectFileNotAccepted() {
  const file = makeNotAcceptedFile();
  cy.fillVaFileInputMultiple(SELECTOR, {}, [file]);
  cy.expectVaFileInputMultipleErrorFileNotAccepted();
  deleteFile();
}

// test that an error is thrown if attempt made to continue without having added a file
function testContinueWithoutFile() {
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.expectVaFileInputMultipleRequired();
}

function testAdditionalInfo() {
  testFileUpload(makeMinimalPNG);

  // assert error appears when required field is empty
  cy.waitForVaFileInputMultipleAdditionalInfo();
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.expectVaFileInputMultipleAdditionalInfoError('Choose a document status');
  // set value so we can proceed (error clears on next form validation, not on value change)
  cy.selectVaFileInputMultipleAdditionalInfo('public');

  deleteFile();
}

// test happy path
function uploadValidFileAndNavigateToReviewPage() {
  cy.wrap(makeMinimalJPG()).then(file => {
    testFileUpload([file]);
  });
  cy.selectVaFileInputMultipleAdditionalInfo('public');
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.url().should('include', '/review-and-submit');
}

const fileInputMultiplePage = 'file-input-multiple';
const reviewAndSubmit = 'review-and-submit';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['fileInputMultiple'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      'chapter-select': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`va-button[text="Deselect all"]`).click();
          cy.selectVaCheckbox('root_chapterSelect_fileInputMultiple', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      [fileInputMultiplePage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-file-input-multiple').should('exist');
          cy.injectAxeThenAxeCheck();
          testAdditionalInfo();
          testRejectFileNotAccepted();
          testContinueWithoutFile();
          testFileUploads();
          testRejectInvalidMimeType();
          testInvalidUTF8Encoding();
          testFileSizeLimits();
          testEncryptedPdf();
          uploadValidFileAndNavigateToReviewPage();
        });
      },
      [reviewAndSubmit]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('va-accordion-item[data-chapter="fileInputMultiple"]').as(
              'fileInputMultipleSection',
            );

            cy.get('@fileInputMultipleSection').click();
            cy.get('@fileInputMultipleSection')
              .find('div.review-row')
              .eq(1)
              .then($el => {
                expect($el[0].querySelector('dd').textContent).to.equal(
                  'placeholder.jpg',
                );
              });
            cy.get('@fileInputMultipleSection')
              .find('va-button')
              .click();

            deleteFile();
            testFileUpload([makeMinimalTxtFile()]);
            cy.selectVaFileInputAdditionalInfo('public');

            cy.get('@fileInputMultipleSection')
              .contains('button', 'Update page')
              .click();

            cy.get('@fileInputMultipleSection')
              .find('div.review-row')
              .eq(1)
              .then($el => {
                expect($el[0].querySelector('dd').textContent).to.equal(
                  'test.txt',
                );
              });

            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept(
        'POST',
        formConfig.chapters.fileInputMultiple.pages.fileInputMultiple.uiSchema
          .wcv3FileInputMultiple['ui:options'].fileUploadUrl,
        mockFileUpload,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);

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
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .find('va-button-icon')
    .then($el => {
      if ($el.length > 1) {
        $el[1].click();
        cy.get('va-modal')
          .shadow()
          .find('va-button')
          .then($el2 => {
            if ($el2.length > 0) {
              $el2[0].click();
            }
          });
      }
    });
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
  // give component time to reset....
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
}

// test that a file with an invalid mimetype results in an error state
function testRejectInvalidMimeType() {
  cy.wrap(makeMinimalPNG()).then(file => {
    const moddedFile = new File([file], 'placeholder.zip', { type: file.type });
    cy.fillVaFileInputMultiple(SELECTOR, {}, [moddedFile]);

    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('va-card')
      .find('span.usa-error-message')
      .invoke('text')
      .should(
        'match',
        /The file extension doesn.*t match the file format. Please choose a different file./i,
      );
    deleteFile();
  });
}

// test that a file has proper utf8 encoding
function testInvalidUTF8Encoding() {
  const invalidFile = makeInvalidUtf8File();
  cy.fillVaFileInputMultiple(SELECTOR, {}, [invalidFile]);
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('va-card')
    .find('span.usa-error-message')
    .invoke('text')
    .should('match', /The file.*s encoding is not valid/i);
  deleteFile();
}

// test that a file whose size exceeds limit results in an error
function testTooBig() {
  const tooBigFile = makeMinimalTxtFile(100);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [tooBigFile]);
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('va-card')
    .find('span.usa-error-message')
    .invoke('text')
    .should('match', /We can.*t upload your file because it.*s too big\./i);
  deleteFile();
}

// test that a file whose size is less than a limit results in an error
function testTooSmall() {
  const tooSmallFile = makeMinimalTxtFile(1);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [tooSmallFile]);
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('va-card')
    .find('span.usa-error-message')
    .invoke('text')
    .should('match', /We can.*t upload your file because it.*s too small\./i);
  deleteFile();
}

// test that a zero byte file upload results in an error
function testZeroBytes() {
  const zeroFile = makeMinimalTxtFile(0);
  cy.fillVaFileInputMultiple(SELECTOR, {}, [zeroFile]);
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('va-card')
    .find('span.usa-error-message')
    .invoke('text')
    .should(
      'contain',
      'The file you selected is empty. Files must be larger than 0B.',
    );
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
    cy.fillVaFileInputMultiple(SELECTOR, {}, [file]);
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('label')
      .invoke('text')
      .should('contain', 'File password');

    cy.findByText(/continue/i, { selector: 'button' }).click();

    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('va-card')
      .find('span.usa-error-message')
      .invoke('text')
      .should('contain', 'Encrypted file requires a password.');

    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .find('va-text-input')
      .then($el => {
        cy.fillVaTextInput($el, 'testpassword');
      });

    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .then($el => {
        const event = new CustomEvent('vaPasswordChange', {
          detail: { password: 'testpassword' },
          bubbles: true,
          composed: true,
        });
        $el[0].dispatchEvent(event);
      });

    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .find('va-text-input')
      .should('not.exist');
  });
  deleteFile();
}

// test files of a type not specified by accept result in an error
function testRejectFileNotAccepted() {
  const file = makeNotAcceptedFile();

  cy.fillVaFileInputMultiple(SELECTOR, {}, [file]);
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('va-card')
    .find('span.usa-error-message')
    .invoke('text')
    .should('contain', 'We do not accept .fake files. Choose a new file.');
  deleteFile();
}

// test that an error is thrown if attempt made to continue without having added a file
function testContinueWithoutFile() {
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .shadow()
    .find('span.usa-error-message')
    .should('contain', 'File is required.');
}

function testAdditionalInfo() {
  testFileUpload(makeMinimalPNG);

  // add a wait to ensure additional input has fully rendered and updated before triggering validation
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);

  cy.findByText(/continue/i, { selector: 'button' }).click();

  // // we should get an error because additional info not set
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .find('va-select')
    .should('have.attr', 'error', 'Choose a document status')
    .then($select => {
      cy.selectVaSelect($select, 'public');
    });

  // error should be gone
  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .find('va-select')
    .then($select => {
      expect($select.error).to.be.undefined;
    });
  deleteFile();
}

// test happy path
function uploadValidFileAndNavigateToReviewPage() {
  cy.wrap(makeMinimalJPG()).then(file => {
    testFileUpload([file]);
  });

  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .find('va-select')
    .then($el => {
      cy.selectVaSelect($el, 'public');
    });
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
          testContinueWithoutFile();
          testFileUploads();
          testRejectInvalidMimeType();
          testInvalidUTF8Encoding();
          testFileSizeLimits();
          testEncryptedPdf();
          testRejectFileNotAccepted();
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
            cy.get('@fileInputMultipleSection').find('va-button').click();

            deleteFile();
            testFileUpload([makeMinimalTxtFile()]);
            cy.get('va-file-input')
              .find('va-select')
              .then($el => {
                cy.selectVaSelect($el, 'public');
              });

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

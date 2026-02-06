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

const SELECTOR = 'root_wcv3FileInput';

/**
 * test that a file is added and uploaded
 * @param {Function} - a function that returns a file of any type
 */
function testFileUpload(func) {
  cy.wrap(func()).then(file => {
    cy.fillVaFileInput(SELECTOR, {}, file);

    cy.get('va-file-input')
      .shadow()
      .find('va-card')
      .find('span.file-label')
      .should('exist')
      .and('contain', file.name);
  });
}

function deleteFile() {
  cy.get('va-file-input')
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
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
}

// test that an error is thrown if attempt made to continue without having added a file
function testContinueWithoutFile() {
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.get('va-file-input')
    .shadow()
    .find('span.usa-error-message')
    .should('exist');
}

// test adding a variety of file types
function testFileUploads() {
  const funcs = [
    makeMinimalJPG,
    makeMinimalPNG,
    makeMinimalPDF,
    makeMinimalTxtFile,
  ];
  funcs.forEach(func => {
    testFileUpload(func);
    deleteFile();
  });
}

// test that a file with an invalid mimetype results in an error state
function testRejectInvalidMimeType() {
  cy.wrap(makeMinimalPNG()).then(file => {
    // simulate mime type mismatch
    const moddedFile = new File([file], 'placeholder.zip', { type: file.type });
    cy.fillVaFileInput(SELECTOR, {}, moddedFile);

    cy.get('va-file-input')
      .invoke('attr', 'error')
      .should(
        'match',
        /The file extension doesn.*t match the file format. Please choose a different file./i,
      );
  });
  deleteFile();
}

// test that a file with invalid utf8 encoding results in an error state
function testInvalidUTF8Encoding() {
  const invalidFile = makeInvalidUtf8File();
  cy.fillVaFileInput(SELECTOR, {}, invalidFile);
  cy.get('va-file-input')
    .invoke('attr', 'error')
    .should('match', /The file.*s encoding is not valid/i);
  deleteFile();
}

// test that additional info is required and that once set the component is error free
function testAdditionalInfo() {
  testFileUpload(makeMinimalPNG);
  cy.findByText(/continue/i, { selector: 'button' }).click();

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(150);
  // we should get an error because additional info not set
  cy.get('va-file-input')
    .find('va-select')
    .should('have.attr', 'error', 'Choose a document status');

  // set the additional info
  cy.get('va-file-input')
    .find('va-select')
    .then($el => {
      cy.selectVaSelect($el, 'public');
    });

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);

  // error should be gone
  cy.get('va-file-input')
    .find('va-select')
    .should('not.have.attr', 'error');

  deleteFile();
}

// test that a file whose size exceeds limit results in an error
function testTooBig() {
  const tooBigFile = makeMinimalTxtFile(100);
  cy.fillVaFileInput(SELECTOR, {}, tooBigFile);
  cy.get('va-file-input')
    .should('have.attr', 'error')
    .and('include', "We can't upload your file because it's too big.");
  deleteFile();
}

// test that a file whose size is less than a limit results in an error
function testTooSmall() {
  const tooSmallFile = makeMinimalTxtFile(1);
  cy.fillVaFileInput(SELECTOR, {}, tooSmallFile);
  cy.get('va-file-input')
    .should('have.attr', 'error')
    .and('include', "We can't upload your file because it's too small.");
  deleteFile();
}

// test that a zero byte file upload results in an error
function testZeroBytes() {
  const zeroFile = makeMinimalTxtFile(0);
  cy.fillVaFileInput(SELECTOR, {}, zeroFile);
  cy.get('va-file-input')
    .should('have.attr', 'error')
    .and(
      'include',
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
    cy.fillVaFileInput(SELECTOR, {}, file);
    cy.get('va-file-input')
      .find('label')
      .should('contain', 'File password');

    cy.findByText(/continue/i, { selector: 'button' }).click();

    cy.get('va-file-input')
      .find('span.usa-error-message')
      .should('contain', 'Encrypted file requires a password.');

    cy.get('va-file-input')
      .find('va-text-input')
      .then($el => {
        cy.fillVaTextInput($el, 'testpassword');
      });

    cy.get('va-file-input').then($el => {
      const event = new CustomEvent('vaPasswordChange', {
        detail: { password: 'testpassword' },
        bubbles: true,
        composed: true,
      });
      $el[0].dispatchEvent(event);
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(550);

    cy.get('va-file-input')
      .find('span.usa-error-message')
      .should('not.exist');
  });
  deleteFile();
}

// test files of a type not specified by accept result in an error
function testRejectFileNotAccepted() {
  const file = makeNotAcceptedFile();
  cy.fillVaFileInput(SELECTOR, {}, file);
  cy.get('va-file-input')
    .should('have.attr', 'error')
    .and('include', 'We do not accept .fake files. Choose a new file.');
  deleteFile();
}

// test happy path
function uploadValidFileAndNavigateToReviewPage() {
  testFileUpload(makeMinimalPNG);
  cy.get('va-file-input')
    .find('va-select')
    .then($el => {
      cy.selectVaSelect($el, 'public');
    });
  cy.findByText(/continue/i, { selector: 'button' }).click();
  cy.url().should('include', '/review-and-submit');
}

const fileInputPage = 'file-input';
const reviewAndSubmit = 'review-and-submit';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['fileInput'],
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
          cy.selectVaCheckbox('root_chapterSelect_fileInput', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      [fileInputPage]: ({ afterHook }) => {
        afterHook(() => {
          testAdditionalInfo();
          testContinueWithoutFile();
          testFileUploads();
          testRejectInvalidMimeType();
          testInvalidUTF8Encoding();
          testFileSizeLimits();
          testEncryptedPdf();
          testRejectFileNotAccepted();
          uploadValidFileAndNavigateToReviewPage();
          cy.injectAxeThenAxeCheck();
        });
      },
      [reviewAndSubmit]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('va-accordion-item[data-chapter="fileInput"]').as(
              'fileInputSection',
            );

            cy.get('@fileInputSection').click();
            cy.get('@fileInputSection')
              .find('div.review-row')
              .then($el => {
                expect($el[0].querySelector('dt').textContent).to.equal(
                  'Web component v3 file input',
                );
                expect($el[0].querySelector('dd').textContent).to.equal(
                  'placeholder.png',
                );
              });
            cy.get('@fileInputSection')
              .find('va-button')
              .click();

            deleteFile();
            testFileUpload(makeMinimalJPG);
            cy.get('va-file-input')
              .find('va-select')
              .then($el => {
                cy.selectVaSelect($el, 'public');
              });

            cy.get('@fileInputSection')
              .contains('button', 'Update page')
              .click();

            cy.get('@fileInputSection')
              .find('div.review-row')
              .then($el => {
                expect($el[0].querySelector('dd').textContent).to.equal(
                  'placeholder.jpg',
                );
              });
          });
          cy.findAllByText(/Submit application/i, {
            selector: 'button',
          }).click();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept(
        'POST',
        formConfig.chapters.fileInput.pages.fileInput.uiSchema.wcv3FileInput[
          'ui:options'
        ].fileUploadUrl,
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

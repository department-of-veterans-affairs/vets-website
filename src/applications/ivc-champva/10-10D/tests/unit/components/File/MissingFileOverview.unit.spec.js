import React from 'react';
import { expect } from 'chai';
import SupportingDocumentsPage from '../../../../pages/SupportingDocumentsPage';
import { MissingFileConsentPage } from '../../../../pages/MissingFileConsentPage';
import { testComponentRender } from '../../../../../shared/tests/pages/pageTests.spec';
import {
  hasReq,
  checkFlags,
} from '../../../../../shared/components/fileUploads/MissingFileOverview';

import formConfig from '../../../../config/form';
import mockData from '../../../e2e/fixtures/data/test-data.json';

describe('hasReq', () => {
  const data = {
    applicants: [
      {
        missingUploads: [
          { required: true, uploaded: false },
          { required: false, uploaded: false },
        ],
      },
    ],
  };
  it('should return false if applicant is not missing any files', () => {
    const missingRequiredFiles = hasReq([{ missingUploads: [] }], true);
    expect(missingRequiredFiles).to.be.false;
  });
  it('should return true if applicant is missing at least one required file', () => {
    const missingRequiredFiles = hasReq(data.applicants, true);
    expect(missingRequiredFiles).to.be.true;
  });
  it('should return true if applicant is missing at least one optional file', () => {
    const missingRequiredFiles = hasReq(data.applicants, false);
    expect(missingRequiredFiles).to.be.true;
  });
  it('should return false if applicant has uploaded all files when dropUploaded set to true', () => {
    const data2 = {
      applicants: [{ missingUploads: [{ required: true, uploaded: true }] }],
    };
    const missingRequiredFiles = hasReq(data2.applicants, true, true);
    expect(missingRequiredFiles).to.be.false;
  });
});

describe('checkFlags', () => {
  const pages = [{ path: 'birth-cert-upload' }];
  // 'person' represents an applicant or the sponsor
  const person = {
    missingUploads: [
      { path: 'birth-cert-upload', required: true, uploaded: false },
    ],
  };
  it('should set "uploaded" to true when previously missing file not in newListOfMissingFiles', () => {
    const newListOfMissingFiles = [];
    expect(person.missingUploads[0].uploaded).to.be.false; // Verify false at start
    const personChecked = checkFlags(pages, person, newListOfMissingFiles);
    expect(personChecked.missingUploads[0].uploaded).to.be.true;
  });
  it('should create the missingUploads array on a person if not present', () => {
    const personWithArrayAdded = checkFlags(pages, {}, [
      { path: 'birth-cert-upload', required: true },
    ]);
    expect(personWithArrayAdded.missingUploads).to.not.be.undefined;
  });
  it('should set "uploaded" to false when previously uploaded files are removed', () => {
    const fileDeletedPerson = checkFlags(
      pages,
      {
        missingUploads: [
          { path: 'birth-cert-upload', required: true, uploaded: true },
        ],
      },
      [{ path: 'birth-cert-upload' }],
    );
    expect(fileDeletedPerson.missingUploads[0].uploaded).to.be.false;
  });
  it('should be able to accept a pages object with page names as keys', () => {
    // In some cases, a pages object is passed in, in which case checkFlags
    // should extract the pages to an array of objects rather than leaving
    // each pages as a key'd object in a container object.
    const personWithArrayAdded = checkFlags(
      { page1: { path: 'birth-cert-upload' } },
      {},
      [{ path: 'birth-cert-upload' }],
    );
    expect(personWithArrayAdded.missingUploads[0].path === 'birth-cert-upload')
      .to.be.true;
  });
  it('should only track files from conditionally rendered pages', () => {
    const personNeedsOneFile = checkFlags(pages, {}, [
      { path: 'birth-cert-upload', required: true, name: 'Birth Cert' },
    ]);

    expect(personNeedsOneFile.missingUploads.length === 1).to.be.true;

    // Scenario: 'pages' array updates because of conditional render in form:
    const personNeedsDifferentFile = checkFlags(
      [{ path: 'ssn-upload' }],
      personNeedsOneFile,
      [{ path: 'ssn-upload', required: true, name: 'SS Card' }],
    );
    // We now still only track one file, but it's from the current page set
    expect(personNeedsDifferentFile.missingUploads.length === 1).to.be.true;
    expect(personNeedsDifferentFile.missingUploads[0].name).to.equal('SS Card');
  });
  it('should update missingUploads with files from all available pages', () => {
    const personNeedsOneFile = checkFlags(pages, {}, [
      { path: 'birth-cert-upload', required: true, name: 'Birth Cert' },
    ]);

    expect(personNeedsOneFile.missingUploads.length === 1).to.be.true;

    // Scenario: 'pages' array updates because of conditional render in form:
    const personNeedsTwoFiles = checkFlags(
      [{ path: 'ssn-upload' }, { path: 'birth-cert-upload' }],
      personNeedsOneFile,
      [{ path: 'ssn-upload', required: true, name: 'SS Card' }],
    );
    expect(personNeedsTwoFiles.missingUploads.length === 2).to.be.true;
  });
});

testComponentRender(
  'SupportingDocumentsPage',
  <SupportingDocumentsPage
    data={mockData.data}
    contentAfterButtons={{ props: { formConfig } }}
    goBack={() => {}}
    goForward={() => {}}
    setFormData={() => {}}
    disableLinks={false}
    heading={<>test heading</>}
    showMail={false}
    showConsent={false}
  />,
);

testComponentRender(
  'MissingFileConsentPage',
  <MissingFileConsentPage
    data={mockData.data}
    contentAfterButtons={{ props: { formConfig } }}
    goBack={() => {}}
    goForward={() => {}}
    setFormData={() => {}}
    disableLinks={false}
    heading={<>test heading</>}
    showMail={false}
    showConsent={false}
  />,
);

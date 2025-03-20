import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import SupportingDocumentsPage from '../../../../pages/SupportingDocumentsPage';
import { MissingFileConsentPage } from '../../../../pages/MissingFileConsentPage';
import {
  REQUIRED_FILES,
  FILE_UPLOAD_ORDER,
} from '../../../../config/constants';
import {
  testComponentRender,
  getProps,
} from '../../../../../shared/tests/pages/pageTests.spec';
import {
  hasReq,
  checkFlags,
} from '../../../../../shared/components/fileUploads/MissingFileOverview';
import MissingFileList from '../../../../../shared/components/fileUploads/MissingFileList';
import { getAllPages } from '../../../../../shared/tests/helpers';
import SupportingDocsVerification from '../../../../../shared/components/fileUploads/supportingDocsVerification';

import formConfig from '../../../../config/form';
import mockData from '../../../e2e/fixtures/data/test-data.json';

describe('FILE_UPLOAD_ORDER constant', () => {
  it('should match order of file upload fields present in formConfig', () => {
    /* 
    NOTE: FILE_UPLOAD_ORDER must be manually updated if the order
    of file uploads in `formConfig` ever changes. This test serves to
    make sure that happens. The backend relies on this list to properly
    map metadata to the tmp files generated when users upload docs.
    */

    const verifier = new SupportingDocsVerification([]);
    // We want this `FILE_UPLOAD_ORDER` to match what we pull from formConfig.
    // This helper produces a list like:
    //  ['applicantBirthCertOrSocialSecCard','applicantAdoptionPapers', ...]
    const generatedArr = verifier
      .getApplicantFileKeyNames(getAllPages(formConfig))
      .map(el => el.name);

    let orderIsSame = true;
    generatedArr.forEach((el, idx) => {
      if (FILE_UPLOAD_ORDER[idx] !== el) {
        orderIsSame = false;
      }
    });

    expect(
      orderIsSame,
      `Expected FILE_UPLOAD_ORDER array:
      
      ${FILE_UPLOAD_ORDER.join('\n\t')}
      
      to have same order as defined in formConfig:
      
      ${generatedArr.join('\n\t')}

      Please verify that FILE_UPLOAD_ORDER matches the order of file upload properties defined in formConfig.
      `,
    ).to.be.true;
  });
});

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

// Test that the `MissingFileList` component generates the right markup
describe('MissingFileList', () => {
  const data = {
    applicants: [
      {
        applicantName: { first: 'Bill', last: 'Last' },
        // two required files
        missingUploads: [
          {
            name: Object.keys(REQUIRED_FILES)[0],
            path: 'fake/path/to/upload/screen/0',
            required: true,
            uploaded: false,
          },
          {
            name: Object.keys(REQUIRED_FILES)[1],
            path: 'fake/path/to/upload/screen/1',
            required: true,
            uploaded: false,
          },
        ],
      },
    ],
  };
  it('should display matching number of <li>s as missing required files', () => {
    const { mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        {MissingFileList({
          data: data.applicants,
          disableLinks: true,
          subset: true, // required files
          listItemShowNamePrefix: false,
        })}
      </Provider>,
    );

    // We should have one list item for every require file in the testdata
    expect(container.querySelectorAll('li')).to.have.lengthOf(2);
  });

  it('should display matching number of <a>s as missing required files when links enabled', () => {
    const { mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        {MissingFileList({
          data: data.applicants,
          disableLinks: false,
          subset: true, // required files
          listItemShowNamePrefix: false,
        })}
      </Provider>,
    );

    // We should have one list item for every require file in the testdata
    expect(container.querySelectorAll('a')).to.have.lengthOf(2);
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  testNumberOfWebComponentFields,
  testComponentRender,
  getProps,
} from '../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import { getFileSize } from '../../helpers/utilities';

import FileFieldCustom from '../../components/File/FileUpload';
import FileViewField from '../../components/File/FileViewField';

const applicants = [
  {
    applicantSSN: '111221234',
    applicantDOB: '2000-01-03',
    applicantName: {
      first: 'Jerry',
      middle: 'J',
      last: 'Applicant',
      suffix: 'II',
    },
    applicantRelationshipToSponsor: { relationshipToVeteran: 'child' },
  },
];

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.sponsorInformation.pages.page11.schema,
  formConfig.chapters.sponsorInformation.pages.page11.uiSchema,
  2,
  "Sponsor's phone number",
  { sponsorIsDeceased: false },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page14.schema,
  formConfig.chapters.applicantInformation.pages.page14.uiSchema,
  2,
  'Applicant - SSN and date of birth',
  { applicants },
);

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page18.schema,
  formConfig.chapters.applicantInformation.pages.page18.uiSchema,
  2,
  'Applicant - health insurance',
  { applicants },
);

/*
// Commented out because this page doesn't exist currently (but may in future)
testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.applicantInformation.pages.page20.schema,
  formConfig.chapters.applicantInformation.pages.page20.uiSchema,
  0,
  'Upload supporting documents',
  { applicants },
);
*/

testComponentRender('FileFieldCustom', <FileFieldCustom data={{}} />);
testComponentRender(
  'FileViewField',
  <FileViewField
    data={{ supportingDocuments: [{ f1: { name: 'f1', size: 123 } }] }}
  />,
);

describe('FileFieldCustom remove button', () => {
  it('should remove files when clicked', async () => {
    const component = (
      <FileFieldCustom
        data={{ supportingDocuments: [{ name: 'filetest', size: 100 }] }}
      />
    );
    const { mockStore } = getProps();

    const view = render(<Provider store={mockStore}>{component}</Provider>);

    const buttons = $$('va-button', $('.attachment-file', view.container));
    expect(buttons.length === 1).to.be.true;
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect($('.no-attachments', view.container)).to.exist;
    });
  });
});

describe('File sizes', () => {
  it('should be in bytes for values < 999', () => {
    expect(getFileSize(998) === '998 B').to.be.true;
  });
  it('should be in KB for values between a thousand and a million', () => {
    expect(getFileSize(1024) === '1 KB').to.be.true;
  });
  it('should be in MB for values greater than a million', () => {
    expect(getFileSize(2000000) === '2.0 MB').to.be.true;
  });
});

// Call the depends() function for any page that relies on it
describe('dependent page logic', () => {
  it('should be called', () => {
    let depCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { depends } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (depends) {
          depends({ data: '' });
          depCount += 1;
        }
      });
    });

    expect(depCount > 0).to.be.true;
  });
});

// Call the title fn for any page that has a computed title
describe('title text logic', () => {
  it('should be called', () => {
    let titleCount = 0;

    Object.keys(formConfig.chapters).forEach(ch => {
      Object.keys(formConfig.chapters[`${ch}`].pages).forEach(pg => {
        const { title } = formConfig.chapters[`${ch}`].pages[`${pg}`];
        if (typeof title === 'function') {
          title();
          titleCount += 1;
        }
      });
    });

    expect(titleCount > 0).to.be.true;
  });
});

describe('submit property of formConfig', () => {
  it('should be a promise', () => {
    const goToPathSpy = sinon.spy(formConfig.submit);
    formConfig.submit().then(() => {
      expect(goToPathSpy.called).to.be.true;
    });
  });
});

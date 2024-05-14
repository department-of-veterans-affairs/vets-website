import React from 'react';
import { expect } from 'chai';
import { testComponentRender } from 'applications/ivc-champva/shared/tests/pages/pageTests.spec';
import { MissingFileConsentPage } from '../../components/MissingFileConsentPage';
import SupportingDocumentsPage from '../../components/SupportingDocumentsPage';
import formConfig from '../../config/form';
import mockData from '../e2e/fixtures/data/test-data.json';

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
    nonListNameKey="applicantName"
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
    nonListNameKey="applicantName"
  />,
);

describe('Missing file consent page depends function', () => {
  it('should return false if receives bad data', () => {
    expect(
      formConfig.chapters.fileUpload.pages.missingFileConsent.depends(
        undefined,
      ),
    ).to.be.false;
  });
});

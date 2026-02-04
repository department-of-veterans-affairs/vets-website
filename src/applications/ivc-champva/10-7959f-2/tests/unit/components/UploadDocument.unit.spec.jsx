import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getProps } from '../../../../shared/tests/pages/pageTests.spec';
import mockData from '../../e2e/fixtures/data/test-data.json';
import {
  UploadDocumentsVeteran,
  UploadDocumentsProvider,
} from '../../../components/UploadDocuments';

describe('UploadDocumentsVeteran page', () => {
  it('should render upload documents (veteran) component', async () => {
    const component = (
      <UploadDocumentsVeteran
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        data={{ ...mockData.data }}
        setFormData={() => {}}
        goBack={() => {}}
        goForward={() => {}}
        pagePerItemIndex={0}
        updatePage={() => {}}
        onReviewPage
      />
    );

    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);
    expect(view).to.exist;
  });
});

describe('UploadDocumentsProvider page', () => {
  it('should render upload documents (provider) component', async () => {
    const component = (
      <UploadDocumentsProvider
        contentBeforeButtons={<></>}
        contentAfterButtons={<></>}
        data={{ ...mockData.data }}
        setFormData={() => {}}
        goBack={() => {}}
        goForward={() => {}}
        pagePerItemIndex={0}
        updatePage={() => {}}
        onReviewPage
      />
    );

    const { mockStore } = getProps();
    const view = render(<Provider store={mockStore}>{component}</Provider>);
    expect(view).to.exist;
  });
});

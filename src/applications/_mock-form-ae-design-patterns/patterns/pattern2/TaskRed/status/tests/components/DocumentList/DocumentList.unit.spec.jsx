import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { mockApiRequest } from 'platform/testing/unit/helpers';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { formatDateLong } from 'platform/utilities/date';

import DocumentList from '../../../components/DocumentList/DocumentList';
import mockDocumentList from '../../../../form/tests/fixtures/mocks/document-list.json';

describe('DocumentList', () => {
  it('should render not on upload page content', () => {
    const { container } = render(
      <div>
        <DocumentList notOnUploadPage />
      </div>,
    );
    const h2 = $('h2', container);
    expect(h2).to.exist;
    expect(h2.textContent).to.contain('know if VA needs more information');
  });
  it('should render upload page content', done => {
    mockApiRequest(mockDocumentList);
    const data = mockDocumentList.data.attributes;

    const { container } = render(
      <div>
        <DocumentList />
      </div>,
    );

    setTimeout(() => {
      const h2 = $('h2', container);
      expect(h2).to.exist;
      expect(h2.textContent).to.eq('You have letters about your COE request');

      $$('.coe-list-item', container).forEach((item, index) => {
        expect($('h3', item).textContent).to.equal(data[index].documentType);
        expect(item.textContent).to.contain(
          formatDateLong(data[index].createDate),
        );
      });
      done();
    });
  });
});

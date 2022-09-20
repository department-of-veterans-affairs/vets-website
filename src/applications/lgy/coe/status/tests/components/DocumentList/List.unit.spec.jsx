import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { formatDateLong } from 'platform/utilities/date';

import List, {
  formatLabelDate,
  getDocumentType,
  getDownloadLinkLabel,
} from '../../../components/DocumentList/List';
import documentList from '../../../../form/tests/fixtures/mocks/document-list.json';

// Using this process to get around the time zone issues with parsing dates
const testDates = ['2022-02-02', '2021-12-31'].map(date => {
  const mDate = moment(date);
  return { time: mDate.valueOf(), str: mDate.format('MMDDYYYY') };
});

describe('List', () => {
  const documents = documentList.data.attributes;
  it('should render not on upload page content', () => {
    const { container } = render(
      <div>
        <List documents={documents} />
      </div>,
    );

    $$('.coe-list-item', container).forEach((item, index) => {
      const data = documents[index];
      expect($('h3', item).textContent).to.equal(data.title);
      const link = $('va-link', item);
      expect(link.getAttribute('text')).to.contain(
        'Download Notification Letter',
      );
      expect(link.getAttribute('href')).to.contain(
        `v0/coe/document_download/${data.id}`,
      );

      expect(item.textContent).to.contain(
        `Date sent: ${formatDateLong(data.createDate)}`,
      );
    });
  });
});

describe('formatLabelDate', () => {
  it('should return a date in MMDDYYYY format', () => {
    expect(formatLabelDate(testDates[0].time)).to.equal(testDates[0].str);
    expect(formatLabelDate(testDates[1].time)).to.equal(testDates[1].str);
  });
});

describe('getDocumentType', () => {
  // assuming documentType matches `.{file-extension}`
  // which isn't what is seen in the mock data
  it('should return a PDF extension', () => {
    expect(getDocumentType('.pdf')).to.equal('PDF');
  });
  it('should return a jpeg extension', () => {
    expect(getDocumentType('.jpeg')).to.equal('JPEG');
  });
});

describe('getDownloadLinkLabel', () => {
  const prefix = 'Download Notification Letter';
  // assuming documentType matches `.{file-extension}`
  // which isn't what is seen in the mock data
  it('should return link text with a PDF file extension', () => {
    expect(getDownloadLinkLabel(testDates[0].time, '.pdf')).to.equal(
      `${prefix} ${testDates[0].str} (PDF)`,
    );
  });
  it('should return link text with a JPEG file extension', () => {
    expect(getDownloadLinkLabel(testDates[1].time, '.jpeg')).to.equal(
      `${prefix} ${testDates[1].str} (JPEG)`,
    );
  });
});

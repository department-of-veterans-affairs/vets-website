import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ListItem from '../../../components/DocumentList/ListItem';

describe('ListItem', () => {
  it('should render document list item', () => {
    const props = {
      downloadUrl: 'http://example.com/v0/coe/document_download/12341234',
      downloadLinkLabel: 'Download Notification Letter 11-22-2022',
      sentDate: 'July 10, 2022',
      title: 'COE Application First Returned Letter',
      fileName: '12341234.pdf',
    };
    const { container } = render(
      <div>
        <ListItem {...props} />
      </div>,
    );
    expect($('h3', container).textContent).to.contain(props.title);
    expect($('p', container).textContent).to.contain(
      `Date sent: ${props.sentDate}`,
    );
    const link = $('va-link', container);
    expect(link.getAttribute('href')).to.contain(props.downloadUrl);
    expect(link.getAttribute('filename')).to.contain(props.fileName);
    expect(link.getAttribute('text')).to.contain(props.downloadLinkLabel);
  });
});

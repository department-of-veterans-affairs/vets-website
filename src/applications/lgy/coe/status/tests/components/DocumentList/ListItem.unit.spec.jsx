import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ListItem from '../../../components/DocumentList/ListItem';

describe('ListItem', () => {
  it('should render document list item', () => {
    const props = {
      downloadUrl: 'doc-url.com/1234',
      downloadLinkLabel: 'download test.pdf',
      sentDate: 'July 10, 2022',
      title: 'Test file',
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
    const link = $('a', container);
    expect(link.href).to.contain(props.downloadUrl);
    expect(link.textContent).to.contain(props.downloadLinkLabel);
  });
});

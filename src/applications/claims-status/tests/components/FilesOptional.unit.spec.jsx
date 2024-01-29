import React from 'react';

import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';

import FilesOptional from '../../components/FilesOptional';

describe('<FilesOptionalOld>', () => {
  it('should render alert with item data', () => {
    const id = 1;
    const item = {
      displayName: 'Request 1',
      description: 'This is a alert',
    };
    const { container, getByText } = render(
      <FilesOptional id={id} item={item} />,
    );

    getByText(item.displayName);
    getByText(item.description);
    getByText('Optional');
    getByText('- We requested this from others, but upload it if you have it.');
    expect($('va-alert', container)).to.exist;
  });
});

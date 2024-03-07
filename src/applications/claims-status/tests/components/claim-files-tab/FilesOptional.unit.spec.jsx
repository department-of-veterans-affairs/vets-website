import React from 'react';

import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';

import FilesOptional from '../../../components/claim-files-tab/FilesOptional';

describe('<FilesOptional>', () => {
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
    getByText(
      'You don’t have to do anything, but if you have this information you can',
    );
    getByText('add it here.');
    expect($('va-alert', container)).to.exist;
  });
});

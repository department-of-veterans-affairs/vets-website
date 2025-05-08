import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import GetFormHelp from '../../content/GetFormHelp';

describe('GetFormHelp', () => {
  it('should render', () => {
    const { container } = render(<GetFormHelp />);
    expect($$('va-telephone', container).length).to.eq(2);
  });
});

import React from 'react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AppealsV2TabNav from '../../../components/appeals-v2/AppealsV2TabNav';
import { renderWithRouter } from '../../utils';

describe('<AppealsV2TabNav>', () => {
  it('should render', () => {
    const { container } = renderWithRouter(<AppealsV2TabNav />);

    expect($('ul.tabs', container)).to.exist;
  });

  it('should render 2 tabs: Status and Issues', () => {
    const screen = renderWithRouter(<AppealsV2TabNav />);

    screen.getByText('Status');
    screen.getByText('Issues');
  });
});

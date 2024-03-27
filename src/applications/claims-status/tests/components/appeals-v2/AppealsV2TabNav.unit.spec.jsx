import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AppealsV2TabNav from '../../../components/appeals-v2/AppealsV2TabNav';

describe('<AppealsV2TabNav>', () => {
  it('should render', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route index element={<AppealsV2TabNav />} />
        </Routes>
      </MemoryRouter>,
    );

    expect($('ul.tabs', container)).to.exist;
  });

  it('should render 2 tabs: Status and Detail', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route index element={<AppealsV2TabNav />} />
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText('Status');
    screen.getByText('Issues');
  });
});

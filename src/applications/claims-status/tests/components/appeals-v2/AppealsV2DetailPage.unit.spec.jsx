import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  MemoryRouter,
  Outlet,
  Routes,
  Route,
} from 'react-router-dom-v5-compat';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AppealsV2DetailPage from '../../../containers/AppealsV2DetailPage';
import { mockData } from '../../../utils/helpers';

const appeal = mockData.data[0];

describe('<AppealsV2DetailPage>', () => {
  it('renders', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[appeal]} />}>
            <Route index element={<AppealsV2DetailPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect($('#tabPanelv2detail', container)).to.exist;
  });

  it('renders the <Issues> component', () => {
    const screen = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Outlet context={[appeal]} />}>
            <Route index element={<AppealsV2DetailPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    screen.getByText('Issues');
  });
});

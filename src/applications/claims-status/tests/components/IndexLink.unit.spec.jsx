import React from 'react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import IndexLink from '../../components/IndexLink';

const props = {
  id: 'tabStatus',
  to: '/status',
  className: 'tab',
  activeClassName: 'tab--current',
};

describe('<IndexLink>', () => {
  it('should render IndexLink when files tab is not active', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/files`]}>
        <Routes>
          <Route path="files" element={<IndexLink {...props} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect($('.tab', container)).to.exist;
    expect($('.tab.tab--current', container)).to.not.exist;
  });

  it('should render IndexLink when status tab is active', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/status`]}>
        <Routes>
          <Route path="status" element={<IndexLink {...props} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect($('.tab.tab--current', container)).to.exist;
  });
});

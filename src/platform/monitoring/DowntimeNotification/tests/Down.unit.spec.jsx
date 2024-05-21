import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import Down from '../components/Down';

describe('<Down>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <Down appType="test" headerLevel={2} />
      </div>,
    );
    const header = $('h2', container);
    expect(header).to.exist;
    expect(header.textContent).to.eq('This test is down for maintenance');
    expect($('p', container).textContent).to.contain(
      'We’re making some updates to this test to help make it',
    );
  });

  it('should render new appType & headerLevel', () => {
    const { container } = render(
      <div>
        <Down appType="foo" headerLevel={1} />
      </div>,
    );
    const header = $('h1', container);
    expect(header).to.exist;
    expect(header.textContent).to.eq('This foo is down for maintenance');
    expect($('h2', container)).to.not.exist;
    expect($('p', container).textContent).to.contain(
      'We’re making some updates to this foo to help make it',
    );
  });
});

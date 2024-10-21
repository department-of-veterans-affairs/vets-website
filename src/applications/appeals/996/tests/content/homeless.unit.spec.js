import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { homelessPageTitle, homelessPageHeader } from '../../content/homeless';

describe('homelessPageTitle', () => {
  it('should return original content', () => {
    expect(homelessPageTitle({})).to.eq('Homelessness question');
  });
  it('should return new content', () => {
    expect(homelessPageTitle({ hlrUpdatedContent: true })).to.eq(
      'Housing situation',
    );
  });
});

describe('homelessPageHeader', () => {
  it('should return a single space string', () => {
    expect(homelessPageHeader({ formData: {} })).to.eq(' ');
  });
  it('should return an h3 header', () => {
    const formData = { hlrUpdatedContent: true };
    const { container } = render(<div>{homelessPageHeader({ formData })}</div>);
    expect($('h3', container).textContent).to.contain('Housing situation');
  });
});

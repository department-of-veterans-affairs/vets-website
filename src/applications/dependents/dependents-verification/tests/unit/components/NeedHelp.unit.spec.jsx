import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NeedHelp from '../../../components/NeedHelp';

describe('NeedHelp', () => {
  it('should render without wrapper when noWrapper prop is true', () => {
    const { container } = render(<NeedHelp />);
    expect(container.querySelector('va-need-help')).to.not.exist;
    expect(container.querySelector('.help-talk')).to.exist;
  });

  it('should render with wrapper when noWrapper prop is false', () => {
    const { container } = render(<NeedHelp noWrapper={false} />);
    expect(container.querySelector('va-need-help')).to.exist;
    expect(container.querySelector('.help-talk')).to.exist;
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NeedHelp from '../../../components/NeedHelp';

describe('NeedHelp', () => {
  it('renders without crashing', () => {
    const { container } = render(<NeedHelp />);

    const needHelpComponent = container.querySelector('va-need-help');
    expect(needHelpComponent).to.exist;
  });
});

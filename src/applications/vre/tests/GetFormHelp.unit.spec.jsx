import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import GetFormHelp from '../components/GetFormHelp';

describe.skip('GetFormHelp', () => {
  it('should render', () => {
    const { container } = render(<GetFormHelp />);
    expect($$('a', container).length).to.eql(1);
  });
});

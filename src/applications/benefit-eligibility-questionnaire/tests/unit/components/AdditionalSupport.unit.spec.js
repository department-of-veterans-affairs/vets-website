import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AdditionalSupport from '../../../components/AdditionalSupport';

describe('<AdditionalSupport>', () => {
  it('renders', () => {
    const { container } = render(<AdditionalSupport />);

    expect(container.querySelector('#additional-support')).to.exist;
  });
});

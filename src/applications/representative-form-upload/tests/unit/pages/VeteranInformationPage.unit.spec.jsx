import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { veteranInformationPage } from '../../../pages/veteranInformation';

describe('veteranInformationPage', () => {
  const subject = () => render(<veteranInformationPage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});

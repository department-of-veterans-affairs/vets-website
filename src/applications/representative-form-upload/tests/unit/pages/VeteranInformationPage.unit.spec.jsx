import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranInformationPage } from '../../../pages/veteranInformation';

describe('VeteranInformationPage', () => {
  const subject = () => render(<VeteranInformationPage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranIdentificationInformationPage } from '../../../pages/veteranIdentificationInformation';

describe('VeteranIdentificationInformationPage', () => {
  const subject = () => render(<VeteranIdentificationInformationPage />);

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { UploadPage } from '../../../pages/upload';

describe('UploadPage', () => {
  const subject = () => render(<UploadPage />);

  it('renders successfully', () => {
    const { container } = subject();

    expect(container).to.exist;
  });
});

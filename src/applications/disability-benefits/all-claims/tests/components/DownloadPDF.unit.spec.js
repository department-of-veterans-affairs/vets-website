import React from 'react';
import { render } from '@testing-library/react';
import DownloadPDF from '../../components/DownloadPDF';

describe('DownloadPDF', () => {
  it('renders', () => {
    const tree = render(
      <DownloadPDF formNumber="123" fileName="TestFile" size="1.5" />,
    );

    tree.getByText('Download VA Form 123');
  });

  it('renders without optional fields', () => {
    const tree = render(<DownloadPDF />);

    tree.getByText('Download VA Form');
  });
});

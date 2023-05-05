import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import PrintDownload from '../../components/shared/PrintDownload';

describe('Print download menu component', () => {
  it('renders without errors', () => {
    const screen = render(<PrintDownload list />);
    expect(screen);
  });

  it('should display a toggle menu button', () => {
    const screen = render(<PrintDownload list />);

    const emptyMessageElement = screen.getByText(
      'Print or download this list',
      {
        exact: true,
        selector: 'span',
      },
    );
    expect(emptyMessageElement).to.exist;
  });

  it('should say record when not a list', () => {
    const screen = render(<PrintDownload />);

    const emptyMessageElement = screen.getByText(
      'Print or download this record',
      {
        exact: true,
        selector: 'span',
      },
    );
    expect(emptyMessageElement).to.exist;
  });

  it('should display a print button', () => {
    const screen = render(<PrintDownload list />);

    const emptyMessageElement = screen.getByText('Print list', {
      exact: true,
      selector: 'button',
    });
    expect(emptyMessageElement).to.exist;
  });

  it('should display a download pdf file button', () => {
    const screen = render(<PrintDownload list />);

    const emptyMessageElement = screen.getByText('Download list as PDF', {
      exact: true,
      selector: 'button',
    });
    expect(emptyMessageElement).to.exist;
  });

  it('should display a download text file button', () => {
    const screen = render(<PrintDownload list />);

    const emptyMessageElement = screen.getByText(
      'Download list as a text file',
      {
        exact: true,
        selector: 'button',
      },
    );
    expect(emptyMessageElement).to.exist;
  });
});

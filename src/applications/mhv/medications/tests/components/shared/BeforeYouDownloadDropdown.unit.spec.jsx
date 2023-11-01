import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import BeforeYouDownloadDropdown from '../../../components/shared/BeforeYouDownloadDropdown';

describe('What do know before you download dropdown component', () => {
  const setup = () => {
    return render(<BeforeYouDownloadDropdown />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays text inside of drop down', () => {
    const screen = setup();
    const firsListItem = screen.findByText(
      'If you print this page, it won’t include your allergies and reactions to medications.',
    );
    expect(firsListItem).to.exist;
  });
});

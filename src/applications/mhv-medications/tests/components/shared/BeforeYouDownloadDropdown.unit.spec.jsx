import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import BeforeYouDownloadDropdown from '../../../components/shared/BeforeYouDownloadDropdown';
import { pageType } from '../../../util/dataDogConstants';

describe('What do know before you download dropdown component', () => {
  const setup = page => {
    return render(<BeforeYouDownloadDropdown page={page} />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays text inside of drop down on Details page', async () => {
    const screen = setup(pageType.DETAILS);
    const firstItem = await screen.findByText(
      'If you print or download this page,',
    );
    expect(firstItem).to.exist;
  });

  it('displays text inside of drop down on List page', async () => {
    const screen = setup(pageType.LIST);
    const firstItem = await screen.findByText(
      'If you’re on a public or shared computer,',
    );
    expect(firstItem).to.exist;
  });
});

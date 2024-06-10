import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import BeforeYouDownloadDropdown from '../../../components/shared/BeforeYouDownloadDropdown';
import { DD_ACTIONS_PAGE_TYPE } from '../../../util/constants';

describe('What do know before you download dropdown component', () => {
  const setup = page => {
    return render(<BeforeYouDownloadDropdown page={page} />);
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays text inside of drop down on Details page', async () => {
    const screen = setup(DD_ACTIONS_PAGE_TYPE.DETAILS);
    const firstItem = await screen.findByText(
      'If you print or download this page,',
    );
    expect(firstItem).to.exist;
  });

  it('displays text inside of drop down on List page', async () => {
    const screen = setup(DD_ACTIONS_PAGE_TYPE.LIST);
    const firstItem = await screen.findByText(
      'If you’re on a public or shared computer,',
    );
    expect(firstItem).to.exist;
  });
});

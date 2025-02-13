import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import UnsupportedClaimTypePage from '../../../../components/submit-flow/pages/UnsupportedClaimTypePage';

describe('Unsupported claim type page', () => {
  const setUnsupportedClaimSpy = sinon.spy();
  const setPageIndexSpy = sinon.spy();

  const props = {
    pageIndex: 2,
    setIsUnsupportedClaimType: () => setUnsupportedClaimSpy(),
    setPageIndex: () => setPageIndexSpy(),
  };

  it('should render with back button', async () => {
    const screen = render(<UnsupportedClaimTypePage {...props} />);

    expect(
      screen.findByText(`We can’t file this claim in this tool at this time`),
    ).to.exist;
    expect(screen.findByText(`You can still file a claim`)).to.exist;
    expect(screen.findByText(`Call the BTSSS call center`)).to.exist;
    expect($('va-button[text="Back"]')).to.exist;
    fireEvent.click($('va-button[text="Back"]'));
    await waitFor(() => {
      expect(setPageIndexSpy.called).to.be.true;
      expect(setUnsupportedClaimSpy.called).to.be.true;
    });
  });
});

import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import UnsupportedClaimTypePage from '../../../../components/submit-flow/pages/UnsupportedClaimTypePage';
import SmocContextProvider from '../../../../context/SmocContext';

describe('Unsupported claim type page', () => {
  const setUnsupportedClaimSpy = sinon.spy();
  const setPageIndexSpy = sinon.spy();

  const props = {
    pageIndex: 2,
    setIsUnsupportedClaimType: setUnsupportedClaimSpy,
    setPageIndex: setPageIndexSpy,
  };

  it('should render with back button', () => {
    const screen = render(
      <SmocContextProvider value={props}>
        <UnsupportedClaimTypePage />
      </SmocContextProvider>,
    );

    expect(
      screen.getByText(`We can’t file this claim in this tool at this time`),
    ).to.exist;
    expect(screen.getByText(/You can still file a claim/i)).to.exist;
    expect(screen.getByText(/Call the BTSSS call center/i)).to.exist;
    expect($('va-button[text="Back"]')).to.exist;
    fireEvent.click($('va-button[text="Back"]'));
    expect(setPageIndexSpy.called).to.be.true;
    expect(setUnsupportedClaimSpy.called).to.be.true;
  });
});

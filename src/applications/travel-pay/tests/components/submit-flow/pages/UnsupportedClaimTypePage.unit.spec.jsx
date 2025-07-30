import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import UnsupportedClaimTypePage from '../../../../components/submit-flow/pages/UnsupportedClaimTypePage';

describe('Unsupported claim type page', () => {
  const setUnsupportedClaimSpy = sinon.spy();
  const setPageIndexSpy = sinon.spy();

  const props = {
    pageIndex: 2,
    setIsUnsupportedClaimType: () => setUnsupportedClaimSpy(),
    setPageIndex: () => setPageIndexSpy(),
  };

  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should render with back button and record pageview', () => {
    const screen = render(<UnsupportedClaimTypePage {...props} />);

    expect(
      screen.getByText(`We can’t file this claim in this tool at this time`),
    ).to.exist;
    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'unsupported',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(screen.getByText(/You can still file a claim/i)).to.exist;
    expect($('va-button[text="Back"]')).to.exist;
    fireEvent.click($('va-button[text="Back"]'));

    expect(
      recordEventStub.calledWith({
        event: 'smoc-button',
        action: 'click',
        /* eslint-disable camelcase */
        heading_1: 'unsupported',
        link_text: 'back',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect(setPageIndexSpy.called).to.be.true;
    expect(setUnsupportedClaimSpy.called).to.be.true;
  });
});

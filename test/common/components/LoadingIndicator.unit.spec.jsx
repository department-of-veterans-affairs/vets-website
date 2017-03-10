import { expect } from 'chai';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

import LoadingIndicator from '../../../src/js/common/components/LoadingIndicator';

describe('<LoadingIndicator>', () => {
  it('should not focus if setFocus is not set', () => {
    ReactTestUtils.renderIntoDocument(<LoadingIndicator/>);

    expect(document.activeElement.classList.contains('loading-indicator')).to.be.false;
  });
  it('should focus if setFocus is set', () => {
    ReactTestUtils.renderIntoDocument(<LoadingIndicator setFocus/>);

    expect(document.activeElement.classList.contains('loading-indicator')).to.be.true;
  });
});

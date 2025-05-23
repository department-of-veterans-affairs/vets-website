import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { MaxSelectionsAlert } from '../../components/MaxSelectionsAlert';
import { MAX_LENGTH } from '../../constants';

describe('MaxSelectionsAlert', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <MaxSelectionsAlert closeModal={() => {}} appName="Test app" />
      </div>,
    );
    const content = container.innerHTML;

    expect($('va-modal[status="warning"]', container)).to.exist;
    expect(content).to.contain(MAX_LENGTH.SELECTIONS);
    expect(content).to.contain('Test app request');
  });
});

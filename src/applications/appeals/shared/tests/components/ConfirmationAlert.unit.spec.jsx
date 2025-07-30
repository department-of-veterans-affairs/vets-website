import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { ConfirmationAlert } from '../../components/ConfirmationAlert';

describe('ConfirmationAlert', () => {
  it('should render page title', () => {
    const alertContent = <div>Some alert content</div>;
    const { container } = render(
      <ConfirmationAlert alertTitle="Alert title">
        {alertContent}
      </ConfirmationAlert>,
    );

    expect($('va-alert h2', container).textContent).to.eq('Alert title');
    expect($('va-alert', container).textContent).to.contain(
      'Some alert content',
    );
  });
});

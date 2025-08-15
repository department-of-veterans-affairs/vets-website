import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { ConfirmationTitle } from '../../components/ConfirmationTitle';

describe('ConfirmationTitle', () => {
  it('should render page title', () => {
    const { container } = render(
      <ConfirmationTitle pageTitle="Confirmation test" />,
    );

    expect($('h2', container).textContent).to.eq('Confirmation test');
    const printOnly = $('.print-only', container);
    expect(printOnly).to.exist;
    expect($('img[alt]', printOnly)).to.exist;
  });
});

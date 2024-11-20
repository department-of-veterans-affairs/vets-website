import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  ConfirmationTitle,
  ConfirmationAlert,
  ConfirmationReturnLink,
} from '../../components/ConfirmationCommon';

describe('ConfirmationCommon', () => {
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

  describe('ConfirmationAlert', () => {
    it('should render page title', () => {
      const alertContent = <div>Some alert content</div>;
      const { container } = render(
        <ConfirmationAlert
          alertTitle="Alert title"
          alertContent={alertContent}
        />,
      );

      expect($('va-alert h2', container).textContent).to.eq('Alert title');
      expect($('va-alert', container).textContent).to.contain(
        'Some alert content',
      );
    });
  });

  describe('ConfirmationReturnLink', () => {
    it('should render page title', () => {
      const { container } = render(<ConfirmationReturnLink />);

      const screenContent = $('.screen-only', container);
      const link = $('a', screenContent);
      expect(link.textContent).to.contain('Go back to VA.gov');
      expect(link.getAttribute('href')).to.eq('/');
    });
  });
});

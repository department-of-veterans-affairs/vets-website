import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EnrollmentStatusAlert from '../../../../components/FormAlerts/EnrollmentStatusAlert';
import content from '../../../../locales/en/content.json';

describe('ezr <EnrollmentStatusAlert>', () => {
  describe('when the component renders', () => {
    context('when `showError` is set to `false`', () => {
      it('should render `va-alert` with status of `warning`', () => {
        const { container } = render(
          <EnrollmentStatusAlert showError={false} />,
        );
        const selector = container.querySelector('va-alert');
        expect(selector).to.exist;
        expect(selector).to.have.attr('status', 'warning');
      });

      it('should render proper heading level & content', () => {
        const { container } = render(
          <EnrollmentStatusAlert showError={false} />,
        );
        const selectors = {
          title: container.querySelector('h3'),
          action: container.querySelector('.vads-c-action-link--green'),
        };
        expect(selectors.title).to.contain.text(
          content['alert-enrollment-title'],
        );
        expect(selectors.action).to.contain.text(
          content['alert-enrollment-action'],
        );
      });
    });

    context('when `showError` is set to `true`', () => {
      it('should render `va-alert` with status of `error`', () => {
        const { container } = render(<EnrollmentStatusAlert showError />);
        const selector = container.querySelector('va-alert');
        expect(selector).to.exist;
        expect(selector).to.have.attr('status', 'error');
      });

      it('should render proper heading level & content', () => {
        const { container } = render(<EnrollmentStatusAlert showError />);
        const selector = container.querySelector('h3');
        expect(selector).to.contain.text(content['alert-server-title']);
      });
    });
  });
});

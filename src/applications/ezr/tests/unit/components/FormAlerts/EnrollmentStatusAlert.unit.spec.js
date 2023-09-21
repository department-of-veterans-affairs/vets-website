import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EnrollmentStatusAlert from '../../../../components/FormAlerts/EnrollmentStatusAlert';
import content from '../../../../locales/en/content.json';

describe('ezr <EnrollmentStatusAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<EnrollmentStatusAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });

    it('should render proper heading level & content', () => {
      const { container } = render(<EnrollmentStatusAlert />);
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
});

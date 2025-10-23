import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DowntimeWarning from '../../../../components/FormAlerts/DowntimeWarning';
import content from '../../../../locales/en/content.json';

describe('ezr <DowntimeWarning>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<DowntimeWarning />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });

    it('should render proper heading level & content', () => {
      const { container } = render(<DowntimeWarning />);
      const selector = container.querySelector('h2');
      expect(selector).to.exist;
      expect(selector).to.contain.text(content['alert-downtime-title']);
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ServerErrorAlert from '../../../../components/FormAlerts/ServerErrorAlert';
import content from '../../../../locales/en/content.json';

describe('ezr <ServerErrorAlert>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `error`', () => {
      const { container } = render(<ServerErrorAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');
    });

    it('should render proper heading level & content', () => {
      const { container } = render(<ServerErrorAlert />);
      const selector = container.querySelector('h3');
      expect(selector).to.exist;
      expect(selector).to.contain.text(content['alert-server-title']);
    });
  });
});

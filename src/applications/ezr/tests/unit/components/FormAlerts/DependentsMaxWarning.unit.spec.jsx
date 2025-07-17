import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentsMaxWarning from '../../../../components/FormAlerts/DependentsMaxWarning';
import content from '../../../../locales/en/content.json';

describe('ezr <DependentsMaxWarning>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(<DependentsMaxWarning />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'warning');
    });

    it('should render proper content', () => {
      const { container } = render(<DependentsMaxWarning />);
      const selector = container.querySelector('p');
      expect(selector).to.exist;
      expect(selector).to.contain.text(
        content['household-dependent-max-dependents-warning'],
      );
    });
  });
});

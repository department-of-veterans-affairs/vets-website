import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ServerErrorAlert from '../../../../components/FormAlerts/ServerErrorAlert';

describe('hca <ServerErrorAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `error`', () => {
      const { container } = render(<ServerErrorAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');
    });
  });
});

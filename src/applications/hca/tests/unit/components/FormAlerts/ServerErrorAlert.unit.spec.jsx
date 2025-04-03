import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ServerErrorAlert from '../../../../components/FormAlerts/ServerErrorAlert';

describe('hca <ServerErrorAlert>', () => {
  context('when the component renders', () => {
    it('should render `va-alert` with status of `error` and default text', () => {
      const { container, getByText } = render(<ServerErrorAlert />);
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');

      expect(getByText('Something went wrong on our end')).to.exist;
      expect(
        getByText(
          'We’re sorry. Something went wrong on our end. Please try again.',
        ),
      ).to.exist;
    });
    it('should render custom description and headline text when provided', () => {
      const { container, getByText } = render(
        <ServerErrorAlert
          headline="My Headline"
          description="My description"
        />,
      );
      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      expect(selector).to.have.attr('status', 'error');

      expect(getByText('My Headline')).to.exist;
      expect(getByText('My description')).to.exist;
    });
  });
});

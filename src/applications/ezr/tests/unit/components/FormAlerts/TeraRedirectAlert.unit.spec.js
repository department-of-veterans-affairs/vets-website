import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessDescription from '../../../../components/IntroductionPage/ProcessDescription';

describe('ezr <TeraRedirectAlert>', () => {
  describe('when the component renders', () => {
    it('should render the alert with data-testid "ezr-tera-alert-redirect"', () => {
      const { getByTestId } = render(<ProcessDescription />);
      const alert = getByTestId('ezr-tera-alert-redirect');
      expect(alert).to.exist;
    });
  });
});

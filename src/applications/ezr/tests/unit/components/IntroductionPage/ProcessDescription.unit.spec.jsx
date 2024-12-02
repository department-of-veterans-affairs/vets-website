import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ProcessDescription from '../../../../components/IntroductionPage/ProcessDescription';
import content from '../../../../locales/en/content.json';

describe('ezr <ProcessDescription>', () => {
  describe('when the component renders', () => {
    it('should not be empty', () => {
      const { container } = render(<ProcessDescription />);
      expect(container).to.not.be.empty;
    });

    it('should render the form title', () => {
      const { container } = render(<ProcessDescription />);
      const selector = container.querySelector('[data-testid="form-title"]');
      expect(selector).to.contain.text(content['form-title']);
    });
  });
});

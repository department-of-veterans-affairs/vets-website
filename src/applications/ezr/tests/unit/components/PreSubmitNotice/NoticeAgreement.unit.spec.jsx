import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import NoticeAgreement from '../../../../components/PreSubmitNotice/NoticeAgreement';

describe('ezr <NoticeAgreement>', () => {
  describe('when the component renders', () => {
    it('should render with benefits container & the correct number of statements', () => {
      const { container } = render(<NoticeAgreement />);
      const selectors = {
        benefits: container.querySelector('va-additional-info'),
        statements: container.querySelectorAll(
          'li',
          '[data-testid="ezr-agreement-statements"]',
        ),
      };
      expect(selectors.statements).to.have.lengthOf(4);
      expect(selectors.benefits).to.exist;
    });
  });
});

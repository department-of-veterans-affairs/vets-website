import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DischargePapersDescription from '../../../../components/FormDescriptions/DischargePapersDescription';

describe('hca <DischargePapersDescription>', () => {
  context('when form is not in review mode', () => {
    const props = { formContext: { reviewMode: false } };
    it('should render', () => {
      const { container } = render(<DischargePapersDescription {...props} />);
      expect(container).to.not.be.empty;
    });
  });

  context('when form is in review mode', () => {
    const props = { formContext: { reviewMode: true } };
    it('should not render', () => {
      const { container } = render(<DischargePapersDescription {...props} />);
      expect(container).to.be.empty;
    });
  });
});

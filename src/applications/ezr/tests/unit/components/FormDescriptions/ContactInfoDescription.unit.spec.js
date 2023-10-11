import { render } from '@testing-library/react';
import { expect } from 'chai';

import ContactInfoDescription from '../../../../components/FormDescriptions/ContactInfoDescription';

describe('ezr <ContactInfoDescription>', () => {
  describe('when the component renders', () => {
    it('should render `va-alert` with status of `warning`', () => {
      const { container } = render(ContactInfoDescription);
      expect(container).to.not.be.empty;
    });
  });
});

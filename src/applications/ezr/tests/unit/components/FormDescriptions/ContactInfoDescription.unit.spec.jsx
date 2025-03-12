import { render } from '@testing-library/react';
import { expect } from 'chai';

import ContactInfoDescription from '../../../../components/FormDescriptions/ContactInfoDescription';

describe('ezr <ContactInfoDescription>', () => {
  context('when the component renders', () => {
    it('should render with content', () => {
      const { container } = render(ContactInfoDescription);
      expect(container).to.not.be.empty;
    });
  });
});

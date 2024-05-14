import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { InPersonDescription, MailDescription, PhoneDescription } from '.';

describe('ezr submission option descriptions', () => {
  context('when PhoneDescription renders', () => {
    it('should not be empty', () => {
      const { container } = render(<PhoneDescription />);
      expect(container).to.not.be.empty;
    });
  });

  context('when MailDescription renders', () => {
    it('should not be empty', () => {
      const { container } = render(<MailDescription />);
      expect(container).to.not.be.empty;
    });
  });

  context('when InPersonDescription renders', () => {
    it('should not be empty', () => {
      const { container } = render(<InPersonDescription />);
      expect(container).to.not.be.empty;
    });
  });
});

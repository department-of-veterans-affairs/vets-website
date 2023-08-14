import React from 'react';
import { render } from '@testing-library/react';
import { Missing526Identifiers } from '../../containers/Missing526Identifiers';

describe('Form 526 Missing Identifiers Error Message', () => {
  describe('One identifier missing', () => {
    const props = {
      title: 'can file for disability compensation',
      form526RequiredIdentifersPresence: {
        particpantId: true,
        birlsId: true,
        ssn: true,
        birthDate: true,
        edipi: false,
      },
    };

    it('should render a message noting the missing identifier', () => {
      const tree = render(<Missing526Identifiers {...props} />);
      tree.getByText((content, _) =>
        content.startsWith("We're missing your EDIPI."),
      );
    });
  });

  describe('Two identifiers missing', () => {
    const props = {
      title: 'can file for disability compensation',
      form526RequiredIdentifersPresence: {
        particpantId: true,
        birlsId: true,
        ssn: false,
        birthDate: true,
        edipi: false,
      },
    };

    it("should render a message noting the missing identifiers with 'and' between them", () => {
      const tree = render(<Missing526Identifiers {...props} />);
      tree.getByText((content, _) =>
        content.startsWith(
          "We're missing your Social Security Number and EDIPI.",
        ),
      );
    });
  });

  describe('More than two identifiers missing', () => {
    const props = {
      title: 'can file for disability compensation',
      form526RequiredIdentifersPresence: {
        particpantId: false,
        birlsId: true,
        ssn: false,
        birthDate: true,
        edipi: false,
      },
    };

    it("should render a message noting the missing identifiers with commas 'and' between them", () => {
      const tree = render(<Missing526Identifiers {...props} />);
      tree.getByText((content, _) =>
        content.startsWith(
          "We're missing your Participant ID, Social Security Number, and EDIPI",
        ),
      );
    });
  });
});

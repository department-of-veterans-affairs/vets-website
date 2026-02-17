import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  getAtPath,
  setAtPath,
  validateInitialsMatch,
  additionalInstitutionsWithCodeArrayOptions,
  additionalInstitutionsWithoutCodeArrayOptions,
  programInformationArrayOptions,
  officialsArrayOptions,
} from '../helpers';

describe('0839 Helpers', () => {
  describe('validateInitialsMatch', () => {
    let errors;
    const formData = {
      authorizingOfficial: {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
      },
    };

    beforeEach(() => {
      errors = {
        messages: [],
        addError(message) {
          this.messages.push(message);
        },
      };
    });

    it('correctly matches initials', () => {
      validateInitialsMatch(errors, 'JD', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly does nothing with no input', () => {
      validateInitialsMatch(errors, '', formData);
      expect(errors.messages.length).to.eq(0);
    });

    it('correctly returns an error with blank name', () => {
      validateInitialsMatch(errors, 'XX', {
        authorizingOfficial: { fullName: {} },
      });
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly shows an error on unmatched initials', () => {
      validateInitialsMatch(errors, 'XX', formData);
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly shows an error on unsupported characters', () => {
      validateInitialsMatch(errors, '$$', formData);
      expect(errors.messages.length).to.eq(1);
    });

    it('correctly handles hyphenated last names', () => {
      formData.authorizingOfficial.fullName.last = 'Doe-Poe';
      validateInitialsMatch(errors, 'JDP', formData);
      expect(errors.messages.length).to.eq(0);
    });
  });

  describe('getAtPath', () => {
    it('gets the right value', () => {
      const original = {
        a: 1,
        b: { c: [1, { d: 'hello' }, 3] },
      };

      expect(getAtPath(original, 'a')).to.eq(1);
      expect(getAtPath(original, 'b.c.2')).to.eq(3);
      expect(getAtPath(original, 'b.c.1.d')).to.eq('hello');
    });
  });

  describe('setAtPath', () => {
    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: 'A' },
      };

      setAtPath(original, 'a', 15);
      expect(original.a).to.eq(15);
    });

    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: 'A' },
      };

      setAtPath(original, 'b.c', 'Q');
      expect(original.b.c).to.eq('Q');
    });

    it('sets the right value', () => {
      const original = {
        a: 1,
        b: { c: [1, { d: 'hello' }, 3] },
      };

      setAtPath(original, 'b.c.1.d', 'goodbye');
      expect(original.b.c[1].d).to.eq('goodbye');
    });
  });

  describe('additional institution options', () => {
    const exampleItem = {
      name: 'Test Institution',
      facilityCode: '12345678',
      type: 'PUBLIC',
      mailingAddress: {
        street: '123 Maple',
        city: 'Tulsa',
        state: 'OK',
        postalCode: '12345',
        country: 'USA',
      },
    };
    describe('additionalInstitutionsWithCodeArrayOptions', () => {
      const { isItemIncomplete, text } =
        additionalInstitutionsWithCodeArrayOptions;

      it('has the right completeness check', () => {
        expect(isItemIncomplete({ name: null, mailingAddress: null })).to.be
          .true;
        expect(isItemIncomplete(exampleItem)).to.be.false;
      });

      it('has the right text', () => {
        expect(text.cancelAddButtonText({ nounSingular: 'location' })).to.eq(
          'Cancel adding this additional location',
        );
        expect(text.summaryTitle({ nounPlural: 'locations' })).to.eq(
          'Review your additional locations',
        );
      });

      it('has the right card description', () => {
        const description = text.cardDescription(exampleItem);
        const { container } = render(description);
        expect(container.textContent).to.contain('123 Maple');
      });

      it('has the right summary without items', () => {
        const summary = text.summaryDescriptionWithoutItems();
        const { container } = render(summary);
        expect(container.textContent).to.contain(
          'You will need to list all additional locations associated with your institution',
        );
      });
    });
    describe('additionalInstitutionsWithoutCodeArrayOptions', () => {
      const { isItemIncomplete, text } =
        additionalInstitutionsWithoutCodeArrayOptions;

      it('has the right completeness check', () => {
        expect(isItemIncomplete({ name: null, mailingAddress: null })).to.be
          .true;
        expect(isItemIncomplete(exampleItem)).to.be.false;
      });

      it('has the right text', () => {
        expect(text.cancelAddButtonText({ nounSingular: 'location' })).to.eq(
          'Cancel adding this additional location',
        );
        expect(text.summaryTitle({ nounPlural: 'locations' })).to.eq(
          'Review your additional locations',
        );
      });

      it('has the right card description', () => {
        const description = text.cardDescription(exampleItem);
        const { container } = render(description);
        expect(container.textContent).to.contain('123 Maple');
      });

      it('has the right summary without items', () => {
        const summary = text.summaryDescriptionWithoutItems();
        const { container } = render(summary);
        expect(container.textContent).to.contain(
          'You will need to list all additional locations associated with your institution',
        );
        expect(container.textContent).to.contain(
          'These are the extension campuses and additional locations officially associated with your institution.',
        );
      });
    });
  });

  describe('program information options', () => {
    const exampleItem = {
      programName: 'MBA',
      totalProgramLength: 'Semester',
      weeksPerTerm: '16',
      entryRequirements: 'Bachelors',
      creditHours: '1',
    };

    const { isItemIncomplete, text } = programInformationArrayOptions;

    it('has the right completeness check', () => {
      expect(isItemIncomplete({ programName: null, totalProgramLength: null }))
        .to.be.true;
      expect(isItemIncomplete(exampleItem)).to.be.false;
    });

    it('has the right card description', () => {
      const description = text.cardDescription(exampleItem);
      const { container } = render(description);
      expect(container.textContent).to.contain('Semester');
      expect(container.textContent).to.contain('Bachelors');
      expect(container.textContent).to.contain('16 weeks');
      expect(container.textContent).to.contain('1 hour');
    });

    it('has the right card title', () => {
      const title = text.getItemName(exampleItem);
      expect(title).to.eq('MBA');
    });
  });

  describe('officials array options', () => {
    const exampleItem = {
      fullName: {
        first: 'John',
        last: 'Doe',
      },
      title: 'Duke',
    };

    const { isItemIncomplete, text } = officialsArrayOptions;

    it('has the right completeness check', () => {
      expect(isItemIncomplete({ fullName: null, title: null })).to.be.true;
      expect(isItemIncomplete(exampleItem)).to.be.false;
    });

    it('has the right card description', () => {
      const description = text.cardDescription(exampleItem);
      const { container } = render(description);
      expect(container.textContent).to.contain('Duke');
    });

    it('has the right card title', () => {
      const title = text.getItemName(exampleItem);
      expect(title).to.eq('John Doe');
    });

    it('has the right summary without items', () => {
      const summary = text.summaryDescriptionWithoutItems();
      const { container } = render(summary);
      expect(container.textContent).to.contain(
        'you will be asked to provide information about faculty members',
      );
    });
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SecondaryCaregiverDescription from '../../../components/FormDescriptions/SecondaryCaregiverDescription';
import {
  secondaryOnePageIntro,
  secondaryOneContactIntro,
} from '../../../definitions/content';

describe('CG <SecondaryCaregiverDescription>', () => {
  const getSelectors = view => ({
    title: view.container.querySelector('h3'),
    intro: view.container.querySelector('[data-testid="cg-page-intro"]'),
    contact: view.container.querySelector('[data-testid="cg-contact-intro"]'),
    additional: view.container.querySelector('va-additional-info'),
  });

  it('should not render any children when all props have been omitted', () => {
    const view = render(<SecondaryCaregiverDescription />);
    const selectors = getSelectors(view);
    expect(selectors.title).to.not.exist;
    expect(selectors.intro).to.not.exist;
    expect(selectors.contact).to.not.exist;
    expect(selectors.additional).to.not.exist;
  });

  describe('CG SecondaryCaregiverDescription title', () => {
    it('should not render the title when blank', () => {
      const props = {
        pageTitle: '',
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.not.exist;
    });

    it('should render the title when provided', () => {
      const props = {
        pageTitle: 'Secondary Family Caregiver contact information',
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(props.pageTitle);
    });
  });

  describe('CG SecondaryCaregiverDescription page intro', () => {
    it('should not render page intro when `showPageIntro` is `false`', () => {
      const props = {
        showPageIntro: false,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.not.exist;
    });

    it('should render page intro when `showPageIntro` is `true`', () => {
      const props = {
        showPageIntro: true,
        introText: secondaryOnePageIntro,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.exist;
      expect(selectors.intro).to.contain.text(props.introText);
    });
  });

  describe('CG SecondaryCaregiverDescription contact intro', () => {
    it('should not render contact intro when `showContactIntro` is `false`', () => {
      const props = {
        showContactIntro: false,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.contact).to.not.exist;
    });

    it('should render page intro when `showContactIntro` is `true`', () => {
      const props = {
        showContactIntro: true,
        formContext: {
          formData: {
            veteranFullName: {
              first: 'John',
              middle: 'Marjorie',
              last: 'Smith',
            },
            veteranAddress: {
              street: '1375 E Buena Vista Dr',
              street2: 'Apt 1',
              city: 'Orlando',
              state: 'FL',
              postalCode: '32830',
            },
          },
        },
        introText: secondaryOneContactIntro,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.contact).to.exist;
      expect(selectors.contact).to.contain.text(props.introText);
    });
  });

  describe('CG SecondaryCaregiverDescription additional info', () => {
    it('should not render `va-additional-info` when `additionalInfo` is `false`', () => {
      const props = {
        additionalInfo: false,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.additional).to.not.exist;
    });

    it('should render `va-additional-info` when `additionalInfo` is `true`', () => {
      const props = {
        additionalInfo: true,
      };
      const view = render(<SecondaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.additional).to.exist;
      expect(selectors.additional).to.have.attribute(
        'trigger',
        'Learn more about who qualifies as a Secondary Family Caregiver',
      );
    });
  });
});

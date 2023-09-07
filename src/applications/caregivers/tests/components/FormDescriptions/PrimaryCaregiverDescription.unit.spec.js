import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';
import {
  primaryPageIntro,
  primaryContactIntro,
} from '../../../definitions/content';

describe('CG <PrimaryCaregiverDescription>', () => {
  const getSelectors = view => ({
    title: view.container.querySelector('h3'),
    intro: view.container.querySelector('[data-testid="cg-page-intro"]'),
    contact: view.container.querySelector('[data-testid="cg-contact-intro"]'),
    additional: view.container.querySelector('va-additional-info'),
  });

  it('should not render any children when all props have been omitted', () => {
    const view = render(<PrimaryCaregiverDescription />);
    const selectors = getSelectors(view);
    expect(selectors.title).to.not.exist;
    expect(selectors.intro).to.not.exist;
    expect(selectors.contact).to.not.exist;
    expect(selectors.additional).to.not.exist;
  });

  describe('CG PrimaryCaregiverDescription title', () => {
    it('should not render the title when blank', () => {
      const props = {
        pageTitle: '',
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.not.exist;
    });

    it('should render the title when provided', () => {
      const props = {
        pageTitle: 'Primary Family Caregiver contact information',
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(props.pageTitle);
    });
  });

  describe('CG PrimaryCaregiverDescription page intro', () => {
    it('should not render page intro when `showPageIntro` is `false`', () => {
      const props = {
        showPageIntro: false,
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.not.exist;
    });

    it('should render page intro when `showPageIntro` is `true`', () => {
      const props = {
        showPageIntro: true,
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.exist;
      expect(selectors.intro).to.contain.text(primaryPageIntro);
    });
  });

  describe('CG PrimaryCaregiverDescription contact intro', () => {
    it('should not render contact intro when `showContactIntro` is `false`', () => {
      const props = {
        showContactIntro: false,
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
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
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.contact).to.exist;
      expect(selectors.contact).to.contain.text(primaryContactIntro);
    });
  });

  describe('CG PrimaryCaregiverDescription additional info', () => {
    it('should not render `va-additional-info` when `additionalInfo` is `false`', () => {
      const props = {
        additionalInfo: false,
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.additional).to.not.exist;
    });

    it('should render `va-additional-info` when `additionalInfo` is `true`', () => {
      const props = {
        additionalInfo: true,
      };
      const view = render(<PrimaryCaregiverDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.additional).to.exist;
      expect(selectors.additional).to.have.attribute(
        'trigger',
        'Learn more about who qualifies as a Primary Family Caregiver',
      );
    });
  });
});

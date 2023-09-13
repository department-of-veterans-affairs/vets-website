import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import VeteranContactDescription from '../../../components/FormDescriptions/VeteranContactDescription';

describe('CG <VeteranContactDescription>', () => {
  const getSelectors = view => ({
    title: view.container.querySelector('h3'),
    intro: view.container.querySelector('[data-testid="cg-page-intro"]'),
  });

  it('should not render any children when all props have been omitted', () => {
    const view = render(<VeteranContactDescription />);
    const selectors = getSelectors(view);
    expect(selectors.title).to.not.exist;
    expect(selectors.intro).to.not.exist;
  });

  describe('CG VeteranContactDescription title', () => {
    it('should not render the title when blank', () => {
      const props = {
        pageTitle: '',
      };
      const view = render(<VeteranContactDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.not.exist;
    });

    it('should render the title when provided', () => {
      const props = {
        pageTitle: 'Veteran contact information',
      };
      const view = render(<VeteranContactDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.title).to.exist;
      expect(selectors.title).to.contain.text(props.pageTitle);
    });
  });

  describe('CG VeteranContactDescription page intro', () => {
    it('should not render page intro when `showPageIntro` is `false`', () => {
      const props = {
        showPageIntro: false,
      };
      const view = render(<VeteranContactDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.not.exist;
    });

    it('should render page intro when `showPageIntro` is `true`', () => {
      const props = {
        showPageIntro: true,
      };
      const view = render(<VeteranContactDescription {...props} />);
      const selectors = getSelectors(view);
      expect(selectors.intro).to.exist;
      expect(selectors.intro).to.contain.text(
        'Please complete all the following information.',
      );
    });
  });
});

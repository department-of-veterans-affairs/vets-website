import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import 'css.escape';

import NoResultsBanner from '../../../components/NoResultsBanner';

describe('<NoResultsBanner>', () => {
  let wrapper;
  const setup = () => render(<NoResultsBanner />);
  beforeEach(() => {
    wrapper = setup();
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  it('should render va-banner', () => {
    const noResults = document.querySelector('va-banner');
    expect(noResults).to.exist;
  });

  it('should render va-link', () => {
    const link = document.querySelector('va-link');
    expect(link).to.exist;
  });

  it('should render correct headline', () => {
    const noResults = document.querySelector(
      `va-banner[headline=${CSS.escape('No Results Found')}]`,
    );
    expect(noResults).to.exist;
  });

  it('should render va-link text', () => {
    const link = document.querySelector(
      `va-link[text=${CSS.escape('Review or change your answers')}]`,
    );
    expect(link).to.exist;
  });

  it('should render correct no results text', () => {
    const noResultsText =
      'We didn’t find any results that match your answers. If you added filters, try removing the filters. Or you can review or change your answers.';
    const allParagraphs = Array.from(document.querySelectorAll('p'));
    const noResultsParagraph = allParagraphs.filter(p =>
      p.textContent.includes(noResultsText),
    );
    expect(noResultsParagraph).to.exist;
  });

  it('should render correct follow up message', () => {
    const noResultsText =
      'We’re also planning to add more benefits and resources to this tool. Check back soon to find more benefits you may want to apply for.';
    const allParagraphs = Array.from(document.querySelectorAll('p'));
    const noResultsParagraph = allParagraphs.filter(p =>
      p.textContent.includes(noResultsText),
    );
    expect(noResultsParagraph).to.exist;
  });
});

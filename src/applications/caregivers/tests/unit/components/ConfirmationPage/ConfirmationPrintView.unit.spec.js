import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPrintView from '../../../../components/ConfirmationPage/ConfirmationPrintView';
import content from '../../../../locales/en/content.json';

describe('CG <ConfirmationPrintView>', () => {
  const getData = ({ timestamp = undefined }) => ({
    props: {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      timestamp,
    },
  });
  const subject = ({ props }) => render(<ConfirmationPrintView {...props} />);

  it('should render with default props', () => {
    const { props } = getData({});
    const { container } = subject({ props });
    const selectors = {
      image: container.querySelector('.vagov-logo'),
      title: container.querySelector('h1'),
      name: container.querySelector('[data-testid="cg-veteranfullname"]'),
    };
    expect(selectors.image).to.exist;
    expect(selectors.title).to.contain.text(content['app-title']);
    expect(selectors.name).to.contain.text('John Marjorie Smith Sr.');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { props } = getData({});
    const { container } = subject({ props });
    const selector = container.querySelector('[data-testid="cg-timestamp"]');
    expect(selector).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const { props } = getData({ timestamp: 1666887649663 });
    const { container } = subject({ props });
    const selector = container.querySelector('[data-testid="cg-timestamp"]');
    expect(selector).to.exist;
    expect(selector).to.contain.text('Oct. 27, 2022');
  });
});

/**
 * @module tests/containers/introduction-page.unit.spec
 * @description Unit tests for IntroductionPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { IntroductionPage } from './introduction-page';

const props = {
  router: {
    push: () => {},
  },
};

describe('IntroductionPage', () => {
  it('should render', () => {
    const { container } = render(<IntroductionPage {...props} />);
    expect(container).to.exist;
  });
});

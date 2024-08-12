import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { RepresentativeReviewWidget } from '../../content/InformalConferenceRep';

describe('RepresentativeReviewWidget', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <RepresentativeReviewWidget
          name="some-action-name"
          value="some value"
        />
      </div>,
    );
    const span = $(
      '.dd-privacy-hidden[data-dd-action-name="some-action-name"]',
      container,
    );
    expect(span).to.exist;
    expect(span.textContent).to.eq('some value');
  });
});

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { RepresentativeReviewWidget } from '../../content/InformalConference';

describe('RepresentativeReviewWidget', () => {
  it('should return a review row element widget with no value or action name', () => {
    const { container } = render(
      <div>
        <RepresentativeReviewWidget />
      </div>,
    );
    const value = $('span.dd-privacy-hidden', container);
    expect(value.innerHTML).to.contain('');
    expect(value.getAttribute('data-dd-action-name')).to.eq('');
  });
  it('should return a review row element widget with a value & action name data-attribute', () => {
    const { container } = render(
      <div>
        <RepresentativeReviewWidget name="Name" value="Some Value" />
      </div>,
    );
    const value = $('span.dd-privacy-hidden', container);
    expect(value.innerHTML).to.contain('Some Value');
    expect(value.getAttribute('data-dd-action-name')).to.eq('Name');
  });
});

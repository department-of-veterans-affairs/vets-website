/* eslint-disable camelcase */
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import PrepareContent from '../PrepareContent';

describe('PrepareContent', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  it('renders block with feature on', () => {
    const component = render(
      <CheckInProvider
        store={{
          features: { check_in_experience_medication_review_content: true },
        }}
      >
        <PrepareContent />
      </CheckInProvider>,
    );
    expect(component.getByTestId('prepare-content')).to.exist;
  });
  it('does not render block with feature off', () => {
    const component = render(
      <CheckInProvider
        store={{
          features: { check_in_experience_medication_review_content: false },
        }}
      >
        <PrepareContent />
      </CheckInProvider>,
    );
    expect(component.queryByTestId('prepare-content')).to.not.exist;
  });
  it('renders block with small heading', () => {
    const component = render(
      <CheckInProvider
        store={{
          features: { check_in_experience_medication_review_content: true },
        }}
      >
        <PrepareContent smallHeading />
      </CheckInProvider>,
    );
    expect(
      component.getByTestId('prepare-content').querySelector('h2'),
    ).to.have.class('vads-u-font-size--sm');
  });
});

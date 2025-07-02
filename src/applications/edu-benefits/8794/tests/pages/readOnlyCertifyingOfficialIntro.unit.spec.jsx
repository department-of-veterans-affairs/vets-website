import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { readOnlyCertifyingOfficialIntro } from '../../pages/readOnlyCertifyingOfficialIntro';

const IntroWrapper = () => <>{readOnlyCertifyingOfficialIntro}</>;

describe('8794 – Read-only certifying officials • intro fragment', () => {
  it('renders two paragraphs and one <va-alert>', () => {
    const { container } = render(<IntroWrapper />);
    expect(container.querySelectorAll('p').length).to.equal(2);

    expect(container.querySelectorAll('va-alert').length).to.equal(1);
  });
});

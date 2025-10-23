import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { additionalOfficialIntro } from '../../pages/additionalOfficialIntro';

const IntroWrapper = () => <>{additionalOfficialIntro}</>;

describe('8794 – Additional certifying officials • intro fragment', () => {
  it('renders two paragraphs and one <va-alert> and one <h3>', () => {
    const { container } = render(<IntroWrapper />);

    expect(container.querySelectorAll('h3').length).to.equal(1);
    expect(container.querySelectorAll('p').length).to.equal(2);
    expect(container.querySelectorAll('va-alert').length).to.equal(1);
  });
});

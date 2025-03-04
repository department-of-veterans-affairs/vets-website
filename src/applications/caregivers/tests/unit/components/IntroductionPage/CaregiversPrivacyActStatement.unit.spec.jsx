import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CaregiversPrivacyActStatement from '../../../../components/IntroductionPage/CaregiversPrivacyActStatement';

describe('CG <CaregiversPrivacyActStatement>', () => {
  it('should render', () => {
    const view = render(<CaregiversPrivacyActStatement />);
    const selector = view.container.querySelectorAll('p');
    expect(selector).to.have.lengthOf(2);
  });
});

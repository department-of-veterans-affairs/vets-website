import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OMBInfo from '../../../../../components/IntroductionPage/GetStarted/OMBInfo';

describe('hca <OMBInfo>', () => {
  const subject = () => {
    const { container } = render(<OMBInfo />);
    const selectors = () => ({
      vaOmbInfo: container.querySelectorAll('va-omb-info'),
    });
    return { selectors };
  };

  it('should render a `va-omb-info` component', () => {
    const { selectors } = subject();
    expect(selectors().vaOmbInfo).to.exist;
  });
});

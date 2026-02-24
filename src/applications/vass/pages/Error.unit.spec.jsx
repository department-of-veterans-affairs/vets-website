import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import Error from './Error';
import { getDefaultRenderOptions } from '../utils/test-utils';

const defaultRenderOptions = getDefaultRenderOptions();

describe('VASS Component: Error', () => {
  it('should render component with correct structure', () => {
    const {
      getByTestId,
      queryByTestId,
      container,
    } = renderWithStoreAndRouterV6(<Error />, defaultRenderOptions);

    expect(getByTestId('error-page')).to.exist;
    expect(getByTestId('api-error-alert')).to.exist;
    expect(queryByTestId('header')).to.not.exist;
    expect(queryByTestId('back-link')).to.not.exist;
    const alert = getByTestId('api-error-alert');
    expect(alert.textContent).to.exist;
    const telephone = container.querySelector('va-telephone');
    expect(telephone).to.exist;
  });
});

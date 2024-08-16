import React from 'react';

import { render } from '@testing-library/react';
import ElapsedCallTime from '../../../components/phone/ElapsedCallTime';
import { getElapsedCallTime } from './test-helpers/ElapsedCallTimeTestHelpers';

describe('ElapsedCallTime', () => {
  const doRender = ({ props = {} } = {}) =>
    render(<ElapsedCallTime {...props} />);

  it('renders the formatted elapsed time in seconds', () => {
    const view = doRender({
      props: {
        elapsedCallTimeInSeconds: 10,
      },
    });

    getElapsedCallTime(view, '00:10');
  });
});

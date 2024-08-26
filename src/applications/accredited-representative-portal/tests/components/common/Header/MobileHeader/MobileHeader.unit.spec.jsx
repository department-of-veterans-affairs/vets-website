import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import createReduxStore from '../../../../../store';

import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';
import { TestAppContainer } from '../../../../helpers';

function renderTestApp({ initAction } = {}) {
  const store = createReduxStore();
  if (initAction) store.dispatch(initAction);

  return render(
    <TestAppContainer store={store}>
      <MobileHeader />
    </TestAppContainer>,
  );
}

describe('MobileHeader', () => {
  it('renders header on mobile', () => {
    const { getByTestId } = renderTestApp();
    expect(getByTestId('mobile-header')).to.exist;
  });
});

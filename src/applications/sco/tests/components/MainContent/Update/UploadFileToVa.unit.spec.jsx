import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import UploadFileToVa from '../../../../components/MainContent/Update/UploadFileToVa';

describe('UploadFileToVa', () => {
  it('should render correctly with given props', () => {
    const defaultStore = createCommonStore();
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UploadFileToVa />
      </Provider>,
    );

    expect(getByText('Other accepted documents')).to.exist;
  });
});

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import createCommonStore from 'platform/startup/store';

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

import ConfirmationPage from '../../containers/ConfirmationPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);

describe('Confirmation page', () => {
  it('should render the confirmation page', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <ConfirmationPage
          form={{
            formId: formConfig.formId,
            submission: {
              response: Date.now(),
            },
            data: initialData,
          }}
        />
      </Provider>,
    );

    const page = tree.find('ConfirmationPage');
    expect(page.length).to.equal(1);

    tree.unmount();
  });
});

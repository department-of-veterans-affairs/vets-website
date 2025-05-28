import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { getFormDOM } from 'platform/testing/unit/schemaform-utils.jsx';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent';

const defaultStore = createCommonStore();

describe('<VeteranInformationComponent />', () => {
  it('Should Render', () => {
    const wrapper = render(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );
    const formDOM = getFormDOM(wrapper);

    expect(formDOM.querySelectorAll('va-alert').length).to.equal(1);
  });
});

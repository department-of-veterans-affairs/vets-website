import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../../config/form';
import CustomPrefillMessage from '../../../components/CustomPrefillAlert';

const mockStore = state => createStore(() => state);

const initStore = ({ formData } = {}) => {
  return mockStore({
    form: {
      ...createInitialState(formConfig),
      data: formData,
    },
  });
};

describe('CustomPrefillMessage', () => {
  it('should render', () => {
    const fd = { formData: { certifierRole: 'sponsor' } };
    const st = initStore(fd);

    const { container } = render(
      <Provider store={st}>
        <>{CustomPrefillMessage(fd.formData, 'sponsor')}</>
      </Provider>,
    );
    expect(container).to.exist;
    expect(container.innerHTML).to.include('prefilled some details');
  });
  it('should attempt to use fallback view: property if certifierRole not present', () => {
    const fd = { formData: { 'view:certifierRole': 'sponsor' } };
    const st = initStore(fd);

    const { container } = render(
      <Provider store={st}>
        <>{CustomPrefillMessage(fd.formData, 'sponsor')}</>
      </Provider>,
    );
    expect(container).to.exist;
    expect(container.innerHTML).to.include('prefilled some details');
  });
  it('should not display anything if role is unspecified', () => {
    const st = initStore({ formData: {} });

    const { container } = render(
      <Provider store={st}>
        <>{CustomPrefillMessage({})}</>
      </Provider>,
    );
    expect(container).to.exist;
    expect(container.innerHTML).to.eq('');
  });
});

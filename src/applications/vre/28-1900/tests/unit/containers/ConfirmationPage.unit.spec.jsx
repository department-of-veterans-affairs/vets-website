import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect } from 'chai';
import { format } from 'date-fns';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as ui from 'platform/utilities/ui';
import formConfig from '../../../config/form';
import ConfirmationPage, {
  getFullName,
} from '../../../containers/ConfirmationPage';

sinon.stub(ui, 'scrollTo').callsFake(() => {});
sinon.stub(ui, 'waitForRenderThenFocus').callsFake(() => {});

const makeState = submission => ({
  form: {
    data: {
      fullName: {
        first: 'Jane',
        middle: 'Q',
        last: 'Doe',
      },
    },
    formId: formConfig.formId,
    submission,
  },
});

const mountPage = submission => {
  const store = createStore(() => makeState(submission));
  return mount(
    <Provider store={store}>
      <ConfirmationPage />
    </Provider>,
  );
};

describe('28-1900 ConfirmationPage', () => {
  afterEach(() => cleanup());

  it('formats name correctly', () => {
    expect(getFullName({ first: 'A', middle: 'B', last: 'C' })).to.equal(
      'A B C',
    );
    expect(getFullName({ first: 'A', last: 'C' })).to.equal('A C');
    expect(getFullName()).to.equal('');
  });

  it('renders submission info with a date', () => {
    const date = new Date();
    const wrapper = mountPage({ timestamp: date, response: {} });
    expect(wrapper.text()).to.include('VA Form 28-1900');
    expect(wrapper.text()).to.include('Jane Q Doe');
    expect(wrapper.text()).to.include(format(date, 'MMMM d, yyyy'));
    wrapper.unmount();
  });

  it('renders without a date when the timestamp is invalid', () => {
    const wrapper = mountPage({ timestamp: null, response: {} });
    expect(wrapper.text()).to.include('Jane Q Doe');
    expect(wrapper.text()).to.not.include('Date submitted');
    wrapper.unmount();
  });
});

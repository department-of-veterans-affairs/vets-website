import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Notice5103 from '../../components/Notice5103';

describe('<Notice5103>', () => {
  const mockStore = configureStore([]);
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <Notice5103 />
      </Provider>,
    );

    expect($('va-alert', container)).to.exist;
    expect($('va-checkbox', container)).to.exist;
    expect($('va-additional-info', container)).to.not.exist;
  });

  it('should not submit page when unchecked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <Notice5103 goForward={goSpy} setFormData={setFormDataSpy} />
      </Provider>,
    );

    $('va-checkbox', container).__events.vaChange({
      detail: { checked: false },
    });

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { form5103Acknowledged: true };
    const { container, rerender } = render(
      <Provider store={mockStore({})}>
        <Notice5103 goForward={goSpy} data={{}} setFormData={setFormDataSpy} />
      </Provider>,
    );

    $('va-checkbox', container).__events.vaChange({
      detail: { checked: true },
    });

    rerender(
      <Provider store={mockStore({})}>
        <Notice5103
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should update page', () => {
    const updateSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { form5103Acknowledged: true };
    const { container } = render(
      <Provider store={mockStore({})}>
        <Notice5103
          updatePage={updateSpy}
          data={data}
          setFormData={setFormDataSpy}
          onReviewPage
        />
      </Provider>,
    );

    fireEvent.click($(`va-button`, container));
    expect(updateSpy.called).to.be.true;
  });

  it('should render new content', () => {
    const { container } = render(
      // eslint-disable-next-line camelcase
      <Provider store={mockStore({ featureToggles: { sc_new_form: true } })}>
        <Notice5103 />
      </Provider>,
    );

    expect($('va-alert', container)).to.not.exist;
    expect($('va-checkbox', container)).to.exist;
    expect($('va-additional-info', container)).to.exist;
  });
});

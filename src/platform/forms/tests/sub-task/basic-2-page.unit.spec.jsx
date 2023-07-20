import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import SubTask, {
  setStoredSubTask,
  resetStoredSubTask,
} from 'platform/forms/sub-task';

import pages from 'applications/appeals/995/subtask/pages';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

const mockStore = (data = {}) => {
  setStoredSubTask(data);
  return {
    getState: () => ({
      form: {
        data,
      },
      formContext: {
        onReviewPage: false,
        reviewMode: false,
        touched: {},
        submitted: false,
      },
    }),
    subscribe: () => {},
    dispatch: () => ({
      setFormData: () => {},
    }),
  };
};

describe('the Supplemental Claims Sub-task', () => {
  after(() => {
    resetStoredSubTask();
  });
  it('should render the SubTask as a form element', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <SubTask pages={pages} />
      </Provider>,
    );
    const form = $('form[data-page="start"]', container);
    expect(form).to.exist;
    expect($('va-radio-option[value="compensation"]', form)).to.exist;
    expect($('va-radio-option[value="other"]', form)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
  });
  it('should go to the "other" SubTask page and back to "start"', () => {
    const { container } = render(
      <Provider store={mockStore({ benefitType: 'other' })}>
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="other"]', container)).to.exist;
    expect($('va-link[download]', container)).to.exist;

    fireEvent.click($('va-button[back]', container), mouseClick);
    expect($('form[data-page="start"]', container)).to.exist;
  });
  it.skip('should show an error when no selection is made', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;
    const vaRadio = $('va-radio', container);
    expect(vaRadio).to.exist;
    expect(vaRadio.error).to.be.null;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="start"]', container)).to.exist;
    expect(vaRadio.error).to.contain('choose');
  });
  it('should go to the Introduction page when complete', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <Provider store={mockStore({ benefitType: 'compensation' })}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(router.push.args[0][0]).to.include('/introduction');
  });
});

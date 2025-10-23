import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from '../../../forms-system/src/js/utilities/ui';
import SubTask, { setStoredSubTask, resetStoredSubTask } from '../../sub-task';

import pages from './basic-2-page-subtask';

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

describe('Basic 2 page Sub-task', () => {
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
    expect($('va-radio-option[value="yes"]', form)).to.exist;
    expect($('va-radio-option[value="no"]', form)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
  });
  it('should go to the "end" SubTask page and back to "start"', () => {
    const { container } = render(
      <Provider store={mockStore({ choice: 'no' })}>
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="end"]', container)).to.exist;
    expect($('#done', container)).to.exist;

    fireEvent.click($('va-button[back]', container), mouseClick);
    expect($('form[data-page="start"]', container)).to.exist;
  });
  it('should show an error when no selection is made', () => {
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
  it('should go to the "chose-yes" page when complete', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <Provider store={mockStore({ choice: 'yes' })}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(router.push.args[0][0]).to.include('/chose-yes');
  });
});

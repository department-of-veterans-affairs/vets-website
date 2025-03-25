import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { add, format } from 'date-fns';

import { $ } from '../../../forms-system/src/js/utilities/ui';
import SubTask, { setStoredSubTask, resetStoredSubTask } from '../../sub-task';

import pages from './complex-subtask/pages';

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

describe('Form 526 Sub-Task', () => {
  const getDateDiff = (diff, type = 'days') =>
    add(new Date(), { [type]: diff });
  const getDateFormat = date => format(date, 'yyyy-MM-dd');

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
    expect($('va-radio-option[label^="Yes"]', form)).to.exist;
    expect($('va-radio-option[label^="No"]', form)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.not.exist;
  });

  // Not active duty
  it('should get to page before intro page and go back', () => {
    const router = { push: sinon.spy() };
    const data = {
      'view:isActiveDuty': 'no',
      'view:claimType': 'file-claim',
    };
    const { container } = render(
      <Provider store={mockStore(data)}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="appeals"]', container)).to.exist;
    expect($('va-radio', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="file-claim"]', container)).to.exist;
    expect($('#other_ways_to_file_526', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[back]', container), mouseClick);
    expect($('form[data-page="appeals"]', container)).to.exist;

    fireEvent.click($('va-button[back]', container), mouseClick);
    expect($('form[data-page="start"]', container)).to.exist;
  });
  it('should get to intro page if filing for increase', () => {
    const router = { push: sinon.spy() };
    const data = {
      'view:isActiveDuty': 'no',
      'view:claimType': 'file-claim',
    };
    const { container } = render(
      <Provider store={mockStore(data)}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="appeals"]', container)).to.exist;
    expect($('va-radio', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="file-claim"]', container)).to.exist;
    expect($('#other_ways_to_file_526', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(router.push.args[0][0]).to.include('/introduction');
  });
  it('should get to disagreeing (appeals) page dead-end', () => {
    const data = {
      'view:isActiveDuty': 'no',
      'view:claimType': 'disagree-file-claim',
    };
    const { container } = render(
      <Provider store={mockStore(data)}>
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="appeals"]', container)).to.exist;
    expect($('va-radio', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="disagree-file-claim"]', container)).to.exist;
    expect($('a[href="/decision-reviews/"]', container)).to.exist;
    expect($('va-button[continue]', container)).to.not.exist;
    expect($('va-button[back]', container)).to.exist;
  });

  // Active duty
  it('should go to the RAD date page and back to "start"', () => {
    const { container } = render(
      <Provider store={mockStore({ 'view:isActiveDuty': 'yes' })}>
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="rad"]', container)).to.exist;
    expect($('va-date', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[back]', container), mouseClick);
    expect($('form[data-page="start"]', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.not.exist;
  });
  it('should prevent progress when rad date is in the past', async () => {
    const { container } = render(
      <Provider
        store={mockStore({
          'view:isActiveDuty': 'yes',
          radDate: getDateFormat(getDateDiff(-1)),
        })}
      >
        <SubTask pages={pages} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);

    const vaDate = $('va-date', container);
    await waitFor(() => {
      expect($('form[data-page="rad"]', container)).to.exist;
      expect($('va-button[back]', container)).to.exist;
      expect($('va-button[continue]', container)).to.exist;

    expect(vaDate).to.exist;
    expect(vaDate.getAttribute('error')).to.be.null; // no error until submit attempt

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(vaDate.getAttribute('error')).to.contain(
      'valid future separation date',
    );
  });
  it('should go to file early alert & introduction page', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <Provider
        store={mockStore({
          'view:isActiveDuty': 'yes',
          radDate: getDateFormat(getDateDiff(1)),
        })}
      >
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    const vaDate = $('va-date', container);
    expect($('form[data-page="rad"]', container)).to.exist;
    expect(vaDate).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="file-claim-early"]', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(router.push.args[0][0]).to.include('/introduction');
  });
  it('should go to file BDD & introduction page', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <Provider
        store={mockStore({
          'view:isActiveDuty': 'yes',
          radDate: getDateFormat(getDateDiff(93)),
        })}
      >
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    const vaDate = $('va-date', container);
    expect($('form[data-page="rad"]', container)).to.exist;
    expect(vaDate).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="file-bdd"]', container)).to.exist;
    expect(container.textContent).to.include('3 days left to file a BDD');
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(router.push.args[0][0]).to.include('/introduction');
  });
  it('should stop since the Veteran isn’t eligible to file', () => {
    const router = { push: sinon.spy() };
    const { container } = render(
      <Provider
        store={mockStore({
          'view:isActiveDuty': 'yes',
          radDate: getDateFormat(getDateDiff(183)),
        })}
      >
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    const vaDate = $('va-date', container);
    expect($('form[data-page="rad"]', container)).to.exist;
    expect(vaDate).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect($('form[data-page="unable-to-file-bdd"]', container)).to.exist;
    expect(container.textContent).to.include('in 3 days');
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container)).to.not.exist;
  });
});

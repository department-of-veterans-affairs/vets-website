import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import SubTask, {
  setStoredSubTask,
  resetStoredSubTask,
} from 'platform/forms/sub-task';

import pages from 'applications/disability-benefits/all-claims/subtask/pages';

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
  const getDateDiff = (diff, type = 'days') => moment().add(diff, type);
  const getDateFormat = date => date.format('YYYY-MM-DD');

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
  it.skip('should prevent progress when rad date is in the past', () => {
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
    expect($('form[data-page="rad"]', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;

    expect(vaDate).to.exist;
    expect(vaDate.error).to.be.null; // no error until submit attempt

    fireEvent.click($('va-button[continue]', container), mouseClick);
    expect(vaDate.error).to.contain('valid future separation date');
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

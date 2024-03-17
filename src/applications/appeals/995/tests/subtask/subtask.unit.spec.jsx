import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import SubTask, {
  setStoredSubTask,
  resetStoredSubTask,
} from 'platform/forms/sub-task';

import SubTaskContainer from '../../subtask/SubTaskContainer';
import pages from '../../subtask/pages';

const mockStore = ({ data = {} } = {}) => {
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
        <SubTaskContainer />
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
      <Provider store={mockStore({ data: { benefitType: 'other' } })}>
        <SubTaskContainer />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container));
    expect($('form[data-page="other"]', container)).to.exist;
    expect($('va-link[download]', container)).to.exist;

    fireEvent.click($('va-button[back]', container));
    expect($('form[data-page="start"]', container)).to.exist;
  });

  it('should show an error when no selection is made', async () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <SubTaskContainer />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;
    const vaRadio = $('va-radio', container);
    expect(vaRadio).to.exist;
    expect(vaRadio.error).to.be.null;

    // testing empty value branch
    $('va-radio', container).__events.vaValueChange({ detail: {} });

    fireEvent.click($('va-button[continue]', container));

    await waitFor(() => {
      expect($('form[data-page="start"]', container)).to.exist;
      expect(vaRadio.error).to.contain('choose a claim type');
    });
  });
  it('should go to the Introduction page when complete', () => {
    global.window.dataLayer = [];
    const router = { push: sinon.spy() };
    // using SubTask here since SubTaskContainer isn't passing the router to the
    // SubTask component
    const { container } = render(
      <Provider store={mockStore({ data: {} })}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'compensation' },
    });

    expect($('form[data-page="start"]', container)).to.exist;

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'howToWizard-formChange',
      'form-field-type': 'form-radio-buttons',
      'form-field-label':
        'For what benefit type are you requesting a Supplemental Claim?',
      'form-field-value': 'compensation',
    });

    fireEvent.click($('va-button[continue]', container));
    expect(router.push.args[0][0]).to.include('/introduction');
  });

  it('should record "other" page find benefit office link click', () => {
    global.window.dataLayer = [];
    const router = { push: () => {} };
    // using SubTask here since SubTaskContainer isn't passing the router to the
    // SubTask component
    const { container } = render(
      <Provider store={mockStore({ data: {} })}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'other' },
    });

    fireEvent.click($('va-button[continue]', container));
    expect($('va-button[back]', container)).to.exist;

    fireEvent.click($('a[href*="find-address"]', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'howToWizard-alert-link-click',
      'howToWizard-alert-link-click-label': 'benefit office',
    });
  });

  it('should check validate fallback to default (checking branches)', () => {
    expect(pages[0].validate()).to.eq(false);
  });
  it('should check setBenefitType fallback', () => {
    const setPageDataSpy = sinon.spy();
    const StartPage = pages[0].component;
    const { container } = render(<StartPage setPageData={setPageDataSpy} />);

    $('va-radio', container).__events.vaValueChange({ detail: { value: '' } });
    expect(setPageDataSpy.calledWith(''));
  });
});

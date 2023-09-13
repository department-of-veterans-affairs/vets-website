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

import SubTaskContainer from '../../subtask/SubTaskContainer';
import pages from '../../subtask/pages';

const mockStore = ({ data = {}, show995 = true, loading = false } = {}) => {
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
      featureToggles: {
        loading,
        // eslint-disable-next-line camelcase
        supplemental_claim: show995,
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

  it('should render feature toggle loading indicator', () => {
    const { container } = render(
      <Provider store={mockStore({ loading: true })}>
        <SubTaskContainer />
      </Provider>,
    );
    expect(
      $('va-loading-indicator', container).getAttribute('message'),
    ).to.contain('Loading application');
  });
  it('should render WIP alert', () => {
    const { container } = render(
      <Provider store={mockStore({ show995: false })}>
        <SubTaskContainer />
      </Provider>,
    );
    const alert = $('va-alert', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('still working on this feature');
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
  it.skip('should show an error when no selection is made', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <SubTaskContainer />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;
    const vaRadio = $('va-radio', container);
    expect(vaRadio).to.exist;
    expect(vaRadio.error).to.be.null;

    fireEvent.click($('va-button[continue]', container));
    expect($('form[data-page="start"]', container)).to.exist;
    expect(vaRadio.error).to.contain('choose a claim type');
  });
  it('should go to the Introduction page when complete', () => {
    const router = { push: sinon.spy() };
    // using SubTask here since SubTaskContainer isn't passing the router to the
    // SubTask component
    const { container } = render(
      <Provider store={mockStore({ data: { benefitType: 'compensation' } })}>
        <SubTask pages={pages} router={router} />
      </Provider>,
    );

    expect($('form[data-page="start"]', container)).to.exist;

    fireEvent.click($('va-button[continue]', container));
    expect(router.push.args[0][0]).to.include('/introduction');
  });
});

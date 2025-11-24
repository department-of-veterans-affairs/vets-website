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
import { BENEFIT_OFFICES_URL } from '../../constants';

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
    dispatch: action => {
      if (action && typeof action === 'function') {
        return action(mockStore.dispatch, mockStore.getState);
      }

      // Handle SET_DATA action to update storeData
      if (action && action.type === 'SET_DATA') {
        Object.assign(data, action.data);
      }

      return action;
    },
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

  describe('when "disability compensation" is selected for type of claim', () => {
    it('should log the correct event and go to the Introduction page when complete', () => {
      global.window.dataLayer = [];
      const router = { push: sinon.spy() };
      const storeData = {};

      setStoredSubTask(storeData);

      const { container } = render(
        <Provider store={mockStore(storeData)}>
          <SubTask pages={pages} router={router} />
        </Provider>,
      );

      expect($('form[data-page="start"]', container)).to.exist;

      // Trigger the radio button change
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'compensation' },
      });

      fireEvent.click($('va-button[continue]', container));

      const event = global.window.dataLayer[0];

      expect(event).to.deep.equal({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label':
          'What type of claim are you filing a Supplemental Claim for?',
        'form-field-value': 'compensation',
      });

      expect(router.push.args[0][0]).to.include('/introduction');
    });
  });

  describe('when "other" is selected for type of claim', () => {
    it('should log the correct events, go to the "other" SubTask page and back to "start"', () => {
      const { container } = render(
        <Provider store={mockStore({ data: { benefitType: 'other' } })}>
          <SubTaskContainer />
        </Provider>,
      );

      expect($('form[data-page="start"]', container)).to.exist;

      fireEvent.click($('va-button[continue]', container));

      const firstEvent = global.window.dataLayer[0];

      expect(firstEvent).to.deep.equal({
        event: 'howToWizard-formChange',
        'form-field-type': 'form-radio-buttons',
        'form-field-label':
          'What type of claim are you filing a Supplemental Claim for?',
        'form-field-value': 'other',
      });

      const secondEvent = global.window.dataLayer[1];

      expect(secondEvent).to.deep.equal({
        event: 'howToWizard-alert-displayed',
        'reason-for-alert': 'veteran wants to submit an unsupported claim type',
      });

      expect($('form[data-page="other"]', container)).to.exist;
      expect($('va-link[download]', container)).to.exist;

      fireEvent.click($('va-button[back]', container));
      expect($('form[data-page="start"]', container)).to.exist;
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

      const anchor = BENEFIT_OFFICES_URL.split('#')[1];
      fireEvent.click($(`[href$="#${anchor}"]`, container));

      const event = global.window.dataLayer.slice(-1)[0];
      expect(event).to.deep.equal({
        event: 'howToWizard-alert-link-click',
        'howToWizard-alert-link-click-label': 'benefit office',
      });
    });
  });

  describe('when no selection is made', () => {
    it('should show an error', async () => {
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

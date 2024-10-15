import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import InformalConference from '../../components/InformalConference';
import { errorMessages } from '../../constants';

import sharedErrorMessages from '../../../shared/content/errorMessages';

const setup = ({
  toggle = false,
  data = {},
  goBack = () => {},
  goForward = () => {},
  onReviewPage = false,
  setFormData = () => {},
  contentBeforeButtons = <div>before</div>,
  contentAfterButtons = <div>after</div>,
  updatePage = () => {},
} = {}) => {
  const formData = { ...data, hlrUpdatedContent: toggle };
  const mockStore = {
    getState: () => ({
      form: formData,
      featureToggles: {
        // eslint-disable-next-line camelcase
        hlr_updateed_contnet: toggle,
        hlrUpdateedContnet: toggle,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  return render(
    <Provider store={mockStore}>
      <InformalConference
        data={formData}
        goBack={goBack}
        goForward={goForward}
        setFormData={setFormData}
        contentBeforeButtons={contentBeforeButtons}
        contentAfterButtons={contentAfterButtons}
        onReviewPage={onReviewPage}
        updatePage={updatePage}
      />
    </Provider>,
  );
};

describe('<InformalConference>', () => {
  describe('previous content', () => {
    it('should render original page (3 radios)', () => {
      const { container } = setup();
      expect($$('va-radio-option', container).length).to.eq(3);
      expect($$('va-additional-info', container).length).to.eq(0);
      expect($$('button', container).length).to.eq(2);
    });

    it('should show error and not submit page with no selections', () => {
      const goSpy = sinon.spy();
      const { container } = setup({ goForward: goSpy });

      fireEvent.submit($('form', container));

      expect(goSpy.notCalled).to.be.true;
      expect(
        $(
          `[error="${errorMessages.informalConferenceContactChoice}"]`,
          container,
        ),
      ).to.exist;
    });

    it('should set form data with "rep"', () => {
      const setSpy = sinon.spy();
      const { container } = setup({ setFormData: setSpy });
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'rep' },
      });
      expect(
        setSpy.calledWith({
          hlrUpdatedContent: false,
          informalConference: 'rep',
        }),
      ).to.be.true;
    });

    it('should set form data with "me"', () => {
      const setSpy = sinon.spy();
      const { container } = setup({ setFormData: setSpy });
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'me' },
      });
      expect(
        setSpy.calledWith({
          hlrUpdatedContent: false,
          informalConference: 'me',
        }),
      ).to.be.true;
    });

    it('should set form data with "no"', () => {
      const setSpy = sinon.spy();
      const { container } = setup({ setFormData: setSpy });
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'no' },
      });
      expect(
        setSpy.calledWith({
          hlrUpdatedContent: false,
          informalConference: 'no',
        }),
      ).to.be.true;
    });

    it('should allow submit with selected value', () => {
      const goSpy = sinon.spy();
      const { container } = setup({
        goForward: goSpy,
        data: { informalConference: 'rep' },
      });

      fireEvent.submit($('form', container));
      expect(goSpy.called).to.be.true;
    });
  });

  describe('new content', () => {
    it('should render new page (2 radios)', () => {
      const { container } = setup({ toggle: true });
      expect($$('va-radio-option', container).length).to.eq(2);
      expect($$('va-additional-info', container).length).to.eq(1);
      expect($$('button', container).length).to.eq(2);
    });

    it('should show error and not submit page with no selections', () => {
      const goSpy = sinon.spy();
      const { container } = setup({ goForward: goSpy, toggle: true });

      fireEvent.submit($('form', container));

      expect(goSpy.notCalled).to.be.true;
      expect($(`[error="${sharedErrorMessages.requiredYesNo}"]`, container)).to
        .exist;
    });

    it('should set form data with "yes"', () => {
      const setSpy = sinon.spy();
      const { container } = setup({
        toggle: true,
        setFormData: setSpy,
      });
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'yes' },
      });
      expect(
        setSpy.calledWith({
          hlrUpdatedContent: true,
          informalConferenceChoice: 'yes',
        }),
      ).to.be.true;
    });

    it('should set form data with "no"', () => {
      const setSpy = sinon.spy();
      const { container } = setup({ toggle: true, setFormData: setSpy });
      $('va-radio', container).__events.vaValueChange({
        detail: { value: 'no' },
      });
      expect(
        setSpy.calledWith({
          hlrUpdatedContent: true,
          informalConferenceChoice: 'no',
        }),
      ).to.be.true;
    });

    it('should allow submit with selected value', () => {
      const goSpy = sinon.spy();
      const { container } = setup({
        toggle: true,
        goForward: goSpy,
        data: { informalConferenceChoice: 'no' },
      });

      fireEvent.submit($('form', container));
      expect(goSpy.called).to.be.true;
    });
  });
});

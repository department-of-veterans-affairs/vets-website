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

import sharedErrorMessages from '../../../shared/content/errorMessages';

const setup = ({
  data = {},
  goBack = () => {},
  goForward = () => {},
  onReviewPage = false,
  setFormData = () => {},
  contentBeforeButtons = <div>before</div>,
  contentAfterButtons = <div>after</div>,
  updatePage = () => {},
} = {}) => {
  const mockStore = {
    getState: () => ({
      form: data,
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  return render(
    <Provider store={mockStore}>
      <InformalConference
        data={data}
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
  it('should render new page (2 radios)', () => {
    const { container } = setup();
    expect($$('va-radio-option', container).length).to.eq(2);
    expect($$('va-additional-info', container).length).to.eq(1);
    expect($$('va-button', container).length).to.eq(2);
  });

  it('should show error and not submit page with no selections', () => {
    const goSpy = sinon.spy();
    const { container } = setup({ goForward: goSpy });

    fireEvent.submit($('form', container));

    expect(goSpy.notCalled).to.be.true;
    expect($(`[error="${sharedErrorMessages.requiredYesNo}"]`, container)).to
      .exist;
  });

  it('should set form data with "yes"', () => {
    const setSpy = sinon.spy();
    const { container } = setup({ setFormData: setSpy });
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'yes' },
    });
    expect(
      setSpy.calledWith({
        informalConferenceChoice: 'yes',
        informalConference: undefined,
      }),
    ).to.be.true;
  });

  it('should set form data with "no"', () => {
    const setSpy = sinon.spy();
    const { container } = setup({
      setFormData: setSpy,
      data: { informalConference: 'me' },
    });
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'no' },
    });
    expect(
      setSpy.calledWith({
        informalConferenceChoice: 'no',
        informalConference: 'me',
      }),
    ).to.be.true;
  });

  it('should set form data with "no"', () => {
    const setSpy = sinon.spy();
    const { container } = setup({
      setFormData: setSpy,
      data: { informalConference: 'no' },
    });
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'yes' },
    });
    expect(
      setSpy.calledWith({
        informalConferenceChoice: 'yes',
        informalConference: '', // will clear informalConference if set to "no"
      }),
    ).to.be.true;
  });

  it('should allow submit with selected value', () => {
    const goSpy = sinon.spy();
    const { container } = setup({
      goForward: goSpy,
      data: { informalConferenceChoice: 'no' },
    });

    fireEvent.submit($('form', container));
    expect(goSpy.called).to.be.true;
  });

  it('should allow submit with selected value on review page', () => {
    const { container } = setup({
      data: { informalConference: 'rep', informalConferenceChoice: 'no' },
      onReviewPage: true,
    });

    fireEvent.click($('va-button', container));
  });
});

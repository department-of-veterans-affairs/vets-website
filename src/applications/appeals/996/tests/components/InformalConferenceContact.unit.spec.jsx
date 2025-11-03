import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import InformalConferenceContact from '../../components/InformalConferenceContact';
import { errorMessages } from '../../constants';

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
  return render(
    <InformalConferenceContact
      data={data}
      goBack={goBack}
      goForward={goForward}
      setFormData={setFormData}
      contentBeforeButtons={contentBeforeButtons}
      contentAfterButtons={contentAfterButtons}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
    />,
  );
};

describe('<InformalConferenceContact>', () => {
  it('should render', () => {
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
        informalConference: 'me',
      }),
    ).to.be.true;
  });

  it('should allow submit with selected value', () => {
    const goSpy = sinon.spy();
    const { container } = setup({
      goForward: goSpy,
      data: { informalConference: 'me' },
    });

    fireEvent.submit($('form', container));
    expect(goSpy.called).to.be.true;
  });

  it('should allow submit with selected value on review page', () => {
    const { container } = setup({
      data: { informalConference: 'me', informalConferenceChoice: 'yes' },
      onReviewPage: true,
    });

    fireEvent.click($('va-button', container));
  });
});

import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { PrimaryPhone } from '../../components/PrimaryPhone';
import { PRIMARY_PHONE, errorMessages } from '../../constants';
import { content } from '../../content/primaryPhone';

import { $, $$ } from '../../utils/ui';

describe('<PrimaryPhone>', () => {
  const setup = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    onReviewPage = false,
    setFormData = () => {},
    updatePage = () => {},
  } = {}) => {
    return (
      <div>
        <PrimaryPhone
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
          onReviewPage={onReviewPage}
          updatePage={updatePage}
          contentAfterButtons={<div id="before">Before</div>}
          contentBeforeButtons={<div id="after">After</div>}
        />
      </div>
    );
  };

  it('should render', () => {
    const { container } = render(setup());
    expect($$('va-radio-option', container).length).to.eq(2);
  });
  it('should prevent submission when empty', () => {
    const goForwardSpy = sinon.spy();
    const data = setup({
      goForward: goForwardSpy,
      data: {
        veteran: {
          homePhone: { areaCode: '123', phoneNumber: '4567890' },
          mobilePhone: { areaCode: '123', phoneNumber: '4567891' },
        },
      },
    });
    const { container } = render(data);
    fireEvent.click($('button[type="submit"]', container));

    expect($('va-radio', container).error).to.contain(
      errorMessages.missingPrimaryPhone,
    );
    expect($$('#before, #after', container).length).to.eq(2);
    expect(goForwardSpy.notCalled).to.be.true;
  });

  it('should submit when everything is valid', () => {
    const goForwardSpy = sinon.spy();
    const data = setup({
      goForward: goForwardSpy,
      data: {
        [PRIMARY_PHONE]: 'mobile',
        veteran: {
          homePhone: { areaCode: '123', phoneNumber: '4567890' },
          mobilePhone: { areaCode: '123', phoneNumber: '4567891' },
        },
      },
    });
    const { container } = render(data);
    fireEvent.click($('button[type="submit"]', container));

    expect($('va-radio', container).error).to.be.null;
    expect(goForwardSpy.called).to.be.true;
  });

  it('should render on review & submit page', () => {
    const { container } = render(setup({ onReviewPage: true }));
    expect($$('va-radio-option', container).length).to.eq(2);
    expect($('va-button', container).getAttribute('text')).to.eq(
      content.update,
    );
  });
  it('should call updatePage on review & submit page', () => {
    const updatePageSpy = sinon.spy();
    const { container } = render(
      setup({ onReviewPage: true, updatePage: updatePageSpy }),
    );
    expect($$('va-radio-option', container).length).to.eq(2);
    fireEvent.click($('va-button', container));

    expect(updatePageSpy.called).to.be.true;
  });
});

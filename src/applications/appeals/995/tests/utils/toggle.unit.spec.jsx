import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import {
  showScNewForm,
  UpdatedPagesAlert,
  checkRedirect,
  clearRedirect,
} from '../../utils/toggle';

import { SC_NEW_FORM_DATA, HAS_REDIRECTED } from '../../constants';

describe('showScNewForm', () => {
  it('should return expected value', () => {
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: undefined })).to.be.undefined;
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: true })).to.be.true;
    expect(showScNewForm({ [SC_NEW_FORM_DATA]: false })).to.be.false;
  });
});

describe('UpdatedPagesAlert', () => {
  const setup = () =>
    render(
      <div>
        <UpdatedPagesAlert />
      </div>,
    );

  it('should render when session storage is set', () => {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    const { container } = setup();
    expect($('va-alert[status="info"]', container)).to.exist;
    sessionStorage.removeItem(HAS_REDIRECTED);
  });

  it('should not render when session storage is not set', () => {
    sessionStorage.removeItem(HAS_REDIRECTED);
    const { container } = setup();
    expect($('va-alert[status="info"]', container)).to.not.exist;
  });
});

describe('checkRedirect', () => {
  beforeEach(() => {
    sessionStorage.removeItem(HAS_REDIRECTED);
  });
  afterEach(() => {
    sessionStorage.removeItem(HAS_REDIRECTED);
  });

  it('should return redirected URL from non-Veteran info page', () => {
    expect(checkRedirect({}, '/living-situation')).to.eq('/housing-risk');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.eq('true');
  });

  it('should return redirected URL from housing-risk page (even though it is the same)', () => {
    expect(checkRedirect({}, '/housing-risk')).to.eq('/housing-risk');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.eq('true');
  });

  it('should return veteran-information URL when form data flag is not set', () => {
    expect(checkRedirect({}, '/veteran-information')).to.eq(
      '/veteran-information',
    );
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.be.null;
  });

  it('should return veteran-information URL when form data flag is set', () => {
    expect(
      checkRedirect({ [HAS_REDIRECTED]: true }, '/veteran-information'),
    ).to.eq('/veteran-information');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.be.null;
  });

  it('should return original returnUrl if form data flag is set', () => {
    expect(
      checkRedirect({ [HAS_REDIRECTED]: true }, '/living-situation'),
    ).to.eq('/living-situation');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.be.null;
  });
});

describe('clearRedirect', () => {
  afterEach(() => {
    sessionStorage.removeItem(HAS_REDIRECTED);
  });

  it('should set form data flag if not already set & clear session storage', () => {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    const setDataSpy = sinon.spy();
    clearRedirect({}, setDataSpy);
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.be.null;
    expect(setDataSpy.called).to.be.true;
    expect(setDataSpy.calledWith({ [HAS_REDIRECTED]: true })).to.be.true;
  });

  it('should not set form data flag if already set', () => {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    const setDataSpy = sinon.spy();
    clearRedirect({ [HAS_REDIRECTED]: true }, setDataSpy);
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.eq('true');
    expect(setDataSpy.called).to.be.false;
  });
});

import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { itfSuccess, itfActive, itfExpander } from '../../content/itfWrapper';

import {
  parseDateWithOffset,
  getReadableDate,
} from '../../../shared/utils/dates';

describe('ITF success alert content', () => {
  it('should render current expiration date only', () => {
    const hasPreviousItf = false;
    const expirationDate = parseDateWithOffset({ months: +2 });
    const { container } = render(
      <div>{itfSuccess(hasPreviousItf, expirationDate)}</div>,
    );

    const text = container.textContent;
    expect(text).to.contain(
      `will expire on ${getReadableDate(expirationDate)}`,
    );
    expect($$('p', container).length).to.eq(1);
  });
  it('should render correct expiration date & previous expiration date', () => {
    const hasPreviousItf = true;
    const expirationDate = parseDateWithOffset({ months: +4 });
    const prevExpirationDate = parseDateWithOffset({ years: -1 });
    const { container } = render(
      <div>
        {itfSuccess(hasPreviousItf, expirationDate, prevExpirationDate)}
      </div>,
    );

    const text = container.textContent;
    expect(text).to.contain(
      `will expire on ${getReadableDate(expirationDate)}`,
    );
    expect(text).to.contain(
      `that expired on ${getReadableDate(prevExpirationDate)}`,
    );
    expect($$('p', container).length).to.eq(2);
  });
});

describe('ITF active alert content', () => {
  it('should render current expiration date', () => {
    const expirationDate = parseDateWithOffset({ months: +2 });
    const { container } = render(<div>{itfActive(expirationDate)}</div>);

    const text = container.textContent;
    expect(text).to.contain(
      `will expire on ${getReadableDate(expirationDate)}`,
    );
  });
});

describe('ITF expander content', () => {
  it('should add event when expanded', () => {
    global.window.dataLayer = [];
    const { container } = render(<div>{itfExpander}</div>);

    fireEvent.click($('va-additional-info', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: '995-supplemental-claim---form-help-text-clicked',
      'help-text-label':
        'File a Supplemental Claim - Intent to File - What is an intent to file',
    });
  });
});

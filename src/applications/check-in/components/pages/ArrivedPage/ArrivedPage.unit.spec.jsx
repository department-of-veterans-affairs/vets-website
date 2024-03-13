import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import ArrivedPage from '.';

describe('arrived page', () => {
  it('renders the header', () => {
    const { getByTestId } = render(
      <CheckInProvider>
        <ArrivedPage header="foo" />
      </CheckInProvider>,
    );
    expect(getByTestId('header')).to.contain.text('foo');
  });
  it('renders the bodytext', () => {
    const { getByTestId } = render(
      <CheckInProvider>
        <ArrivedPage bodyText="foo" />
      </CheckInProvider>,
    );
    expect(getByTestId('body-text')).to.contain.text('foo');
  });
});

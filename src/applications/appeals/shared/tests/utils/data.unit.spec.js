import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { getFullName, renderFullName } from '../../utils/data';

describe('getFullName', () => {
  it('should return nothing for an empty object', () => {
    expect(getFullName()).to.eq('');
    expect(getFullName({})).to.eq('');
    expect(getFullName({ test: 'foo' })).to.eq('');
  });

  it('should return partial or full name without suffix', () => {
    expect(getFullName({ first: 'first' })).to.eq('first');
    expect(getFullName({ middle: 'mid' })).to.eq('mid');
    expect(getFullName({ last: ' last ' })).to.eq('last');
    expect(getFullName({ first: ' first', last: 'last ' })).to.eq('first last');
    expect(getFullName({ first: 'first', middle: 'mid' })).to.eq('first mid');
    expect(getFullName({ middle: ' mid', last: 'last ' })).to.eq('mid last');
    expect(getFullName({ first: 'first', middle: 'mid', last: 'last' })).to.eq(
      'first mid last',
    );
  });
});

describe('renderFullName', () => {
  it('should render full name with suffix', () => {
    const { container } = render(
      <div>
        {renderFullName({
          first: 'first',
          middle: 'mid',
          last: 'last',
          suffix: 'Jr.',
        })}
      </div>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.eq(
      'first mid last, Jr.',
    );
  });
  it('should render full name without suffix', () => {
    const { container } = render(
      <div>
        {renderFullName({
          first: 'first',
          middle: 'mid',
          last: 'last',
        })}
      </div>,
    );
    expect($('.dd-privacy-hidden', container).textContent).to.eq(
      'first mid last',
    );
  });
  it('should render an empty div', () => {
    const { container } = render(<div>{renderFullName()}</div>);
    expect($('.dd-privacy-hidden', container)).to.not.exist;
    expect(container.innerHTML).to.eq('<div></div>');
  });
});

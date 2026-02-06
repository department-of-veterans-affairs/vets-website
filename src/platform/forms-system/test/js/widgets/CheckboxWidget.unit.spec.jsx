import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';

import CheckboxWidget from '../../../src/js/widgets/CheckboxWidget';

describe('Schemaform <CheckboxWidget>', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CheckboxWidget
        id="1"
        value
        required
        disabled={false}
        onChange={onChange}
        options={{ title: 'Title' }}
      />,
    );
    expect(container.textContent).to.include('Title');
    expect(container.querySelector('input').checked).to.be.true;
    expect(
      container.querySelectorAll('.form-required-span').length,
    ).not.to.equal(0);
  });
  it('should handle change', async () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CheckboxWidget
        id="1"
        value
        required
        disabled={false}
        onChange={onChange}
        options={{ title: 'Title' }}
      />,
    );
    const input = container.querySelector('input');
    await userEvent.click(input);
    expect(onChange.calledWith(false)).to.be.true;
  });
  it('should add custom props', () => {
    const onChange = sinon.spy();
    const { container } = render(
      <CheckboxWidget
        id="1"
        required
        disabled={false}
        onChange={onChange}
        options={{
          widgetProps: {
            false: { 'data-test': 'unchecked' },
          },
        }}
      />,
    );
    expect(container.querySelector('input').getAttribute('data-test')).to.equal(
      'unchecked',
    );
  });
});

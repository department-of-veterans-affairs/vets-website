import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import VAFileNumberWidget from '../../../src/js/widgets/VAFileNumberWidget';

const defaultProps = {
  schema: {
    type: 'text',
  },
  onBlur: () => {},
  id: 'vafn-test',
  formContext: {},
  options: {},
};

describe('Schemaform <VAFileNumberWidget>', () => {
  it('should render', () => {
    const { container } = render(
      <VAFileNumberWidget
        value="12345678"
        onChange={() => {}}
        {...defaultProps}
      />,
    );
    const input = container.querySelector('input');
    expect(input.value).to.equal('12345678');
  });

  describe('for 9 characters', () => {
    it('should remove dashes on change', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <VAFileNumberWidget value="" onChange={onChange} {...defaultProps} />,
      );
      const input = container.querySelector('input');
      fireEvent.change(input, { target: { value: '123-45-5677' } });
      expect(onChange.calledWith('123455677')).to.be.true;
    });

    it('should call onChange with undefined if the value is blank', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <VAFileNumberWidget
          value="123121234"
          onChange={onChange}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.change(input, { target: { value: '' } });
      expect(onChange.calledWith(undefined)).to.be.true;
    });

    it('should call onChange with the value if available', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <VAFileNumberWidget
          value="456431098"
          onChange={onChange}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.change(input, { target: { value: '432549877' } });
      expect(onChange.calledWith('432549877')).to.be.true;
    });

    it('should mask all but the last four digits of the VAFileNumber onBlur and display with dashes when VAFileNumber is entered as all one digit', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456431098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      expect(input.value).to.equal('●●●-●●-1098');
    });

    it('should mask all but the last four digits of the VAFileNumber onBlur and display with dashes when VAFileNumber is entered with dashes', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456-43-1098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      expect(input.value).to.equal('●●●-●●-1098');
    });

    it('should mask all but the last four digits of the VAFileNumber onBlur and display with dashes when VAFileNumber is entered with spaces', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456 43 1098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      expect(input.value).to.equal('●●●-●●-1098');
    });

    it('should not mask the VAFileNumber onFocus', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456431098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      fireEvent.focus(input);
      expect(input.value).to.equal('456431098');
    });

    it('should display the VAFileNumber with dashes when VAFileNumber is entered with dashes', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456-43-1098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      fireEvent.focus(input);
      expect(input.value).to.equal('456-43-1098');
    });

    it('should display the VAFileNumber with spaces when the VAFileNumber is entered with spaces', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="456 43 1098"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      fireEvent.focus(input);
      expect(input.value).to.equal('456 43 1098');
    });

    it('should not mask any digits of the VAFileNumber onBlur when fewer than 9 digits are entered', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="12345678"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      expect(input.value).to.equal('12345678');
    });

    it('should not mask any digits of the VAFileNumber onBlur when moew than 9 digits are entered', () => {
      const { container } = render(
        <VAFileNumberWidget
          value="1234567899"
          onChange={() => {}}
          {...defaultProps}
        />,
      );
      const input = container.querySelector('input');
      fireEvent.blur(input);
      expect(input.value).to.equal('1234567899');
    });
  });
});

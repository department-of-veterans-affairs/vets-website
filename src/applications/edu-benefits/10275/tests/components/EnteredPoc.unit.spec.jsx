import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import sinon from 'sinon';
import EnteredPoc from '../../components/EnteredPoc';

describe('EnteredPoc', () => {
  const mockOptions = [
    { key: 'option1', label: 'Option 1', email: 'option1@example.com' },
    { key: 'option2', label: 'Option 2', email: 'option2@example.com' },
  ];

  it('renders the component', () => {
    const { container } = render(<EnteredPoc options={mockOptions} />);
    expect(container).to.exist;
  });

  it('renders the component with the correct number of options', () => {
    const { container } = render(<EnteredPoc options={mockOptions} />);
    expect(container).to.exist;
    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('renders options with correct labels and emails', () => {
    const { container } = render(<EnteredPoc options={mockOptions} />);
    const options = $$('va-radio-option', container);
    expect(options[0].getAttribute('label')).to.equal('Option 1');
    expect(options[1].getAttribute('label')).to.equal('Option 2');
  });

  it('should show selected option when value prop is a string', () => {
    const { container } = render(
      <EnteredPoc options={mockOptions} value="option1" />,
    );
    const checkedOption = $$('va-radio-option[checked]', container)[0];
    expect(checkedOption).to.exist;
    expect(checkedOption.getAttribute('value')).to.equal('option1');
  });

  it('should show selected option when value prop is an object with key', () => {
    const { container } = render(
      <EnteredPoc options={mockOptions} value={{ key: 'option1' }} />,
    );
    const checkedOption = $$('va-radio-option[checked]', container)[0];
    expect(checkedOption).to.exist;
    expect(checkedOption.getAttribute('value')).to.equal('option1');
  });

  it('should render "none" option correctly', () => {
    const optionsWithNone = [
      ...mockOptions,
      {
        key: 'none',
        label: 'None of the above, I will enter a new point of contact',
        email: '',
        data: { key: 'none' },
      },
    ];

    const { container } = render(<EnteredPoc options={optionsWithNone} />);
    expect($$('va-radio-option', container).length).to.equal(3);
  });

  describe('handleChange', () => {
    it('should call onChange with full data object when option has data', () => {
      const onChange = sinon.spy();
      const optionsWithData = [
        {
          key: 'option1',
          label: 'Option 1',
          email: 'option1@example.com',
          data: {
            key: 'option1',
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '555-1234',
            title: 'Director',
          },
        },
        {
          key: 'option2',
          label: 'Option 2',
          email: 'option2@example.com',
          data: { key: 'option2' },
        },
      ];

      const { container } = render(
        <EnteredPoc options={optionsWithData} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'option1' },
        }),
      );

      expect(onChange.calledOnce).to.be.true;
      expect(
        onChange.calledWith({
          key: 'option1',
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '555-1234',
          title: 'Director',
        }),
      ).to.be.true;
    });

    it('should call onChange with fallback { key: k } when option has no data property', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'option2' },
        }),
      );

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.calledWith({ key: 'option2' })).to.be.true;
    });

    it('should call onChange with fallback { key: k } when option.data is null', () => {
      const onChange = sinon.spy();
      const optionsWithNullData = [
        {
          key: 'option1',
          label: 'Option 1',
          email: 'option1@example.com',
          data: null,
        },
        {
          key: 'option2',
          label: 'Option 2',
          email: 'option2@example.com',
        },
      ];

      const { container } = render(
        <EnteredPoc options={optionsWithNullData} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'option1' },
        }),
      );

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.calledWith({ key: 'option1' })).to.be.true;
    });

    it('should not call onChange when e.detail.value is undefined', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: undefined },
        }),
      );

      expect(onChange.called).to.be.false;
    });

    it('should not call onChange when e.detail.value is null', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: null },
        }),
      );

      expect(onChange.called).to.be.false;
    });

    it('should not call onChange when e.detail.value is empty string', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: '' },
        }),
      );

      expect(onChange.called).to.be.false;
    });

    it('should not call onChange when e.detail is missing', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(radio, new CustomEvent('vaValueChange', {}));

      expect(onChange.called).to.be.false;
    });

    it('should update selected key state when valid option is selected', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'option1' },
        }),
      );
      const checkedOptions = $$('va-radio-option[checked]', container);
      expect(checkedOptions[0].getAttribute('value')).to.equal('option1');
    });

    it('should handle option not found in options array', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <EnteredPoc options={mockOptions} onChange={onChange} />,
      );

      const radio = $('va-radio', container);
      fireEvent(
        radio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'nonExistentOption' },
        }),
      );

      expect(onChange.calledOnce).to.be.true;
      expect(
        onChange.calledWith({
          key: 'nonExistentOption',
        }),
      ).to.be.true;
    });
  });
});

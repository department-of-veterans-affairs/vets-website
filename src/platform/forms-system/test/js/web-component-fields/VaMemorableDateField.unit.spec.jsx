import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '../../../src/js/utilities/ui';

import VaMemorableDateField from '../../../src/js/web-component-fields/VaMemorableDateField';

describe('VaMemorableDateField', () => {
  const getProps = ({
    onChange = () => {},
    onBlur = () => {},
    options = {},
    value = '',
  } = {}) => ({
    label: 'test',
    childrenProps: {
      formData: value,
      onChange,
      onBlur,
      schema: { type: 'string' },
      uiSchema: {},
      idSchema: { $id: 'test' },
    },
    uiOptions: options,
  });

  it('should render with default props', () => {
    const { container } = render(<VaMemorableDateField {...getProps()} />);
    expect($('va-memorable-date', container)).to.exist;
  });

  it('should pass monthSelect option to va-memorable-date', () => {
    const props = getProps({ options: { monthSelect: false } });
    const { container } = render(<VaMemorableDateField {...props} />);
    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('month-select')).to.equal('false');
  });

  it('should default monthSelect to true', () => {
    const props = getProps();
    const { container } = render(<VaMemorableDateField {...props} />);
    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('month-select')).to.equal('true');
  });

  it('should pass removeDateHint option to va-memorable-date', () => {
    const props = getProps({ options: { removeDateHint: true } });
    const { container } = render(<VaMemorableDateField {...props} />);
    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('remove-date-hint')).to.equal('true');
  });

  it('should not include removeDateHint attribute when not set', () => {
    const props = getProps();
    const { container } = render(<VaMemorableDateField {...props} />);
    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('remove-date-hint')).to.be.null;
  });

  it('should pass customYearErrorMessage option to va-memorable-date', () => {
    const props = getProps({
      options: { customYearErrorMessage: 'Custom year error' },
    });
    const { container } = render(<VaMemorableDateField {...props} />);
    const dateField = $('va-memorable-date', container);
    expect(dateField.getAttribute('custom-year-error-message')).to.equal(
      'Custom year error',
    );
  });
});

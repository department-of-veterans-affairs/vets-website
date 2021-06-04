import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { FormSignature } from '../../../src/js/components/FormSignature';

describe('Forms library - Forms signature component', () => {
  const signatureProps = {
    formData: {},
    onSectionComplete: () => {},
    setFormData: () => {},
    showError: true,
  };

  it('should render inputs with default labels', () => {
    const { getByLabelText } = render(<FormSignature {...signatureProps} />);
    expect(getByLabelText('Veteran’s full name')).to.exist;
  });

  it('should render input with custom string label', () => {
    const { getByLabelText } = render(
      <FormSignature {...signatureProps} label={'Custom text here'} />,
    );
    expect(getByLabelText('Custom text here')).to.exist;
  });

  it('should render input with custom React element label', () => {
    const customLabel = <span>Custom text here</span>;
    const { getByLabelText } = render(
      <FormSignature {...signatureProps} label={customLabel} />,
    );
    expect(getByLabelText('Custom text here')).to.exist;
  });

  it('should render "on behalf of" text', () => {});

  it('should call setFormData ...when the name is entered..?', () => {});

  it('should call onSectionComplete when the checkbox is checked', () => {});

  it('should perform data validations if present', () => {});
});

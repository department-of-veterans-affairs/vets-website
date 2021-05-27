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

  it('should render inputs', () => {
    const { getByLabelText } = render(<FormSignature {...signatureProps} />);
    expect(getByLabelText('Veteran’s full name')).to.exist;
  });

  it('should render default content', () => {});

  it('should render custom content', () => {});

  it('should render "on behalf of" text', () => {});

  it('should call setFormData ...when the name is entered..?', () => {});

  it('should call onSectionComplete when the checkbox is checked', () => {});

  it('should perform data validations if present', () => {});
});

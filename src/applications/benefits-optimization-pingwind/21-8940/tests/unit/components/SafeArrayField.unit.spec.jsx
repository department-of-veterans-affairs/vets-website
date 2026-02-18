import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';

import SafeArrayField from '../../../components/SafeArrayField';

describe('21-8940 component/SafeArrayField', () => {
  let capturedProps;

  const ArrayFieldStub = props => {
    capturedProps = props;
    return <div data-testid="array-field-stub" />;
  };

  const baseProps = {
    schema: {},
    formContext: {},
    onChange: () => {},
    arrayFieldComponent: ArrayFieldStub,
  };

  afterEach(() => {
    capturedProps = undefined;
    cleanup();
  });

  const renderField = overrideProps => {
    render(<SafeArrayField {...baseProps} {...overrideProps} />);
    return capturedProps;
  };

  it('passes through existing array formData', () => {
    const formData = ['first', 'second'];
    const props = renderField({ formData, foo: 'bar' });

    expect(props.formData).to.equal(formData);
    expect(props.foo).to.equal('bar');
  });

  it('defaults undefined formData to an empty array', () => {
    const props = renderField({ formData: undefined });

    expect(props.formData).to.deep.equal([]);
  });

  it('coerces non-array formData to an empty array', () => {
    const props = renderField({ formData: { not: 'an array' } });

    expect(props.formData).to.deep.equal([]);
  });
});

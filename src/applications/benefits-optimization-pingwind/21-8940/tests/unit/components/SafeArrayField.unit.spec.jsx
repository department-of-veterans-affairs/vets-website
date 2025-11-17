import { expect } from 'chai';

import SafeArrayField from '../../../components/SafeArrayField';

describe('21-8940 component/SafeArrayField', () => {
  const baseProps = {
    schema: {},
    formContext: {},
    onChange: () => {},
  };

  it('passes through existing array formData', () => {
    const formData = ['first', 'second'];

    const element = SafeArrayField({ ...baseProps, formData, foo: 'bar' });

    expect(element.props.formData).to.equal(formData);
    expect(element.props.foo).to.equal('bar');
  });

  it('defaults undefined formData to an empty array', () => {
    const element = SafeArrayField({
      ...baseProps,
      formData: undefined,
    });

    expect(element.props.formData).to.deep.equal([]);
  });

  it('coerces non-array formData to an empty array', () => {
    const element = SafeArrayField({
      ...baseProps,
      formData: { not: 'an array' },
    });

    expect(element.props.formData).to.deep.equal([]);
  });
});

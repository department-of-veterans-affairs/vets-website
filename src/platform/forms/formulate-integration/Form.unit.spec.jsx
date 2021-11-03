import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Field } from 'formik';
import { spy } from 'sinon';

import { Form } from './Form';

describe('Formulate integration - Form', () => {
  it('should render', () => {
    const { container } = render(
      <Formik initialValues={{ foo: 'bar' }}>
        <Form>
          <Field name="foo" />
        </Form>
      </Formik>,
    );
    expect(container.querySelector('form')).to.exist;
    expect(container.querySelector('input')).to.exist;
  });

  it('should call setData with the updated form data', () => {
    const inputValue = 'asdf';
    const setData = spy();
    const { getByLabelText } = render(
      <Formik initialValues={{ foo: '' }}>
        <Form setData={setData}>
          <label htmlFor="foo">Foo</label>
          <Field id="foo" name="foo" />
        </Form>
      </Formik>,
    );

    userEvent.type(getByLabelText('Foo'), inputValue);
    expect(setData.calledWith({ foo: inputValue })).to.be.true;
  });
});

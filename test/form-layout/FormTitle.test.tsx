import React from 'react';
import { render } from '@testing-library/react';

import FormRouter from '../../src/routing/Router';
import FormTitle from '../../src/form-layout/FormTitle';

describe('FormTitle', () => {

  test('Renders title from independent instance', () => {
    const { container } = render(
      <FormTitle title="Hello World" subTitle="Hello World Subtitle"></FormTitle>
    );

    const titleText = container.querySelector('h1')?.innerHTML;

    expect(titleText).toContain("Hello World");
  });

  test('Renders subtitle from independent instance', () => {
    const { container } = render(
      <FormTitle title="Hello World" subTitle="Hello World Subtitle"></FormTitle>
    );

    const subtitleText = container.querySelector('.va-form-subtitle')?.innerHTML;

    expect(subtitleText).toContain("Hello World Subtitle");
  });

  test('Form title inherits properties from router', () => {

    const { container } = render(
      <FormRouter basename="" title="hello world" formData={{firstName: ''}}>
      </FormRouter>
    );

    const titleText = container.querySelector('h1')?.innerHTML;
    expect(titleText).toContain("hello world");
  });

  test('Form title inherits properties from router', () => {
    const { container } = render(
    <FormRouter basename="" {...{
      title: "hello world",
      subtitle: "subtitle",
      formData: {firstName: ''}
    }}>
    </FormRouter>);

    const titleText = container.querySelector('.va-form-subtitle')?.innerHTML;
    expect(titleText).toContain("subtitle");
  });
});
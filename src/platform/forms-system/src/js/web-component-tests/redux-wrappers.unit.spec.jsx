import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { hasDynamicProps, withFormData } from '../web-component-helpers';

const mockStore = {
  getState: () => ({
    form: { data: { test: 'Title' } },
    formContext: {
      onReviewPage: false,
      reviewMode: false,
      submitted: false,
      touched: {},
    },
  }),
  subscribe: () => {},
  dispatch: () => ({
    setFormData: () => {},
  }),
};

const MockWebComponentField = props => {
  return (
    <>
      {props.label}
      {props.description}
      {props.uiOptions?.hint}
      {props.uiOptions?.labelHeaderLevel}
    </>
  );
};

const webComponentFieldProps = ({
  title,
  description,
  hint = '',
  labelHeaderLevel = '',
}) => ({
  label: title,
  description,
  required: false,
  uiOptions: {
    hint,
    labelHeaderLevel,
  },
  childrenProps: {
    name: 'test',
    idSchema: { $id: `root_test` },
    schema: {
      type: 'string',
    },
    uiSchema: {
      'ui:title': title,
      'ui:description': description,
      'ui:webComponentField': MockWebComponentField,
      'ui:options': {
        hint,
        labelHeaderLevel,
      },
    },
  },
});

describe('hasDynamicProps', () => {
  it('should not detect dynamic props for strings', () => {
    const props = webComponentFieldProps({
      title: 'hello',
      description: 'hello',
      labelHeaderLevel: 'hello',
      hint: 'hello',
    });
    expect(hasDynamicProps(props)).to.be.false;
  });
  it('should detect dynamic props for functions', () => {
    let props = webComponentFieldProps({
      title: () => 'hello',
      description: 'hello',
      labelHeaderLevel: 'hello',
      hint: 'hello',
    });
    expect(hasDynamicProps(props)).to.be.true;
    props = webComponentFieldProps({
      title: 'hello',
      description: 'hello',
      labelHeaderLevel: () => 'hello',
      hint: 'hello',
    });
    expect(hasDynamicProps(props)).to.be.true;
  });
});

describe('withFormData', () => {
  it('should correctly wrap VaTextInputField with just strings', () => {
    const props = webComponentFieldProps({
      title: 'title',
      description: 'description',
      labelHeaderLevel: 'labelHeaderLevel',
      hint: 'hint',
    });
    const WebComponentFieldWithFormData = withFormData(MockWebComponentField);
    const tree = mount(
      <Provider store={mockStore}>
        <WebComponentFieldWithFormData {...props} />
      </Provider>,
    );
    expect(tree.text()).to.contain('title');
    expect(tree.text()).to.contain('description');
    expect(tree.text()).to.contain('labelHeaderLevel');
    expect(tree.text()).to.contain('hint');
    tree.unmount();
  });

  it('should correctly wrap VaTextInputField with with functions', () => {
    const props = webComponentFieldProps({
      title: () => 'title',
      description: 'description',
      labelHeaderLevel: () => 'labelHeaderLevel',
      hint: () => 'hint',
    });
    const WebComponentFieldWithFormData = withFormData(MockWebComponentField);
    const tree = mount(
      <Provider store={mockStore}>
        <WebComponentFieldWithFormData {...props} />
      </Provider>,
    );
    expect(tree.text()).to.contain('title');
    expect(tree.text()).to.contain('description');
    expect(tree.text()).to.contain('labelHeaderLevel');
    expect(tree.text()).to.contain('hint');
    tree.unmount();
  });
});

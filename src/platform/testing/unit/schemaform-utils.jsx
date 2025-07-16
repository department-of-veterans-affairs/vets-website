/**
 * Utilities for testing forms built with our schema based form library
 */

import Form from '@department-of-veterans-affairs/react-jsonschema-form';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import React from 'react';
import { findDOMNode } from 'react-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import {
  replaceRefSchemas,
  updateSchemasAndData,
} from 'platform/forms-system/src/js/state/helpers';
import { fireEvent } from '@testing-library/dom';
import set from '../../utilities/data/set';

function getDefaultData(schema) {
  if (schema.type === 'array') {
    return [];
  }
  if (schema.type === 'object') {
    return {};
  }

  return undefined;
}

export class DefinitionTester extends React.Component {
  debouncedAutoSave = sinon.spy();

  constructor(props) {
    super(props);
    const { data, uiSchema } = props;
    const definitions = {
      ...(props.definitions || {}),
      ...props.schema.definitions,
    };
    const schema = replaceRefSchemas(props.schema, definitions);

    const {
      data: newData,
      schema: newSchema,
      uiSchema: newUiSchema,
    } = updateSchemasAndData(schema, uiSchema, data || getDefaultData(schema));

    this.state = {
      formData: newData,
      schema: newSchema,
      uiSchema: newUiSchema,
    };
  }

  handleChange = data => {
    const { schema, uiSchema, formData } = this.state;
    const { pagePerItemIndex, arrayPath, updateFormData } = this.props;

    let fullData = data;

    if (arrayPath) {
      fullData = set([arrayPath, pagePerItemIndex], data, formData);
    }

    const newSchemaAndData = updateSchemasAndData(schema, uiSchema, fullData);

    let newData = newSchemaAndData.data;
    const newSchema = newSchemaAndData.schema;
    const newUiSchema = newSchemaAndData.uiSchema;

    if (typeof updateFormData === 'function') {
      if (arrayPath && typeof pagePerItemIndex === 'undefined') {
        // eslint-disable-next-line no-console
        console.error(
          'pagePerItemIndex prop is required when arrayPath is specified',
        );
      }
      newData = updateFormData(
        arrayPath ? formData[arrayPath][pagePerItemIndex] : formData,
        newData,
        pagePerItemIndex,
      );
    }

    this.setState({
      formData: newData,
      schema: newSchema,
      uiSchema: newUiSchema,
    });
  };

  render() {
    let { schema, uiSchema, formData } = this.state;
    const { pagePerItemIndex, arrayPath } = this.props;

    if (arrayPath) {
      schema = schema.properties[arrayPath].items[pagePerItemIndex];
      uiSchema = uiSchema[arrayPath].items;
      formData = formData ? formData[arrayPath][pagePerItemIndex] : formData;
    }

    return (
      <SchemaForm
        onBlur={this.debouncedAutoSave}
        reviewMode={this.props.reviewMode}
        name="test"
        title={this.props.title || 'test'}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        pagePerItemIndex={this.props.pagePerItemIndex}
        onChange={this.handleChange}
        uploadFile={this.props.uploadFile}
        onSubmit={this.props.onSubmit}
        appStateData={this.props.appStateData}
      />
    );
  }
}

export function submitForm(form) {
  ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
    preventDefault: f => f,
  });
}

function getIdentifier(node) {
  const tagName = node.tagName.toLowerCase();
  const id = node.id ? `#${node.id}` : '';
  const name = node.name ? `[name='${node.name}']` : '';
  let classList = '';

  const classes = node.getAttribute('class');
  if (classes) {
    classList = classes.split(' ').reduce((c, carry) => `${c}.${carry}`, '');
    return `${tagName}${classList}`;
  }

  return `${tagName}${id}${name}${classList}`;
}

const bar = '\u2551';
const elbow = '\u2559';
const tee = '\u255F';

function printTree(node, level = 0, isLastChild = true, padding = '') {
  const nextLevel = level + 1;
  const lastPipe = isLastChild ? `${elbow} ` : `${tee} `;

  console.log(`${padding}${lastPipe}${getIdentifier(node)}`); // eslint-disable-line no-console

  const newPadding = padding + (isLastChild ? '  ' : `${bar} `);
  const children = Array.from(node.children);
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    return printTree(child, nextLevel, isLast, newPadding);
  });
}

/**
 * Updated fillDate to support both legacy inputs and Web Components
 */
export function fillDate(form, partialName, dateString) {
  const [year, month, day] = dateString.split('-');

  // --- Web Component Handling ---
  const memorableDateFields = form.find('VaMemorableDateField');

  for (let i = 0; i < memorableDateFields.length; i++) {
    const field = memorableDateFields.at(i);
    const input = field.find('VaMemorableDate');

    // Simplified logic: fallback to ordering
    if (partialName.endsWith('dateRange_from') && i === 0 && input.exists()) {
      input.prop('onDateChange')({ target: { value: dateString } });
      return;
    }

    if (partialName.endsWith('dateRange_to') && i === 1 && input.exists()) {
      input.prop('onDateChange')({ target: { value: dateString } });
      return;
    }
  }

  // --- Fallback for Legacy Inputs ---
  const legacyMonth = form.find(`select[name="${partialName}Month"]`);
  const legacyDay = form.find(`select[name="${partialName}Day"]`);
  const legacyYear = form.find(`input[name="${partialName}Year"]`);

  if (legacyMonth.exists() && legacyDay.exists() && legacyYear.exists()) {
    legacyMonth.simulate('change', { target: { value: month } });
    legacyDay.simulate('change', { target: { value: day } });
    legacyYear.simulate('change', { target: { value: year } });
    return;
  }

  throw new Error(`Could not locate date field for: ${partialName}`);
}

export function getFormDOM(form) {
  const formDOM = form?.container || findDOMNode(form);

  if (!formDOM) {
    throw new Error(
      'Could not find DOM node. Please make sure to pass a component returned from ReactTestUtils.renderIntoDocument(). If you are testing a stateless (function) component, be sure to wrap it in a <div>.',
    );
  }

  formDOM.getElement = function getElement(selector) {
    const element = this.querySelector(selector);
    if (!element) {
      throw new Error(`Could not find element at ${selector}`);
    }
    return element;
  };

  formDOM.fillData = function fillDataFn(id, value) {
    ReactTestUtils.Simulate.change(this.getElement(id), {
      target: {
        value,
      },
    });
    ReactTestUtils.Simulate.input(this.getElement(id), {
      target: {
        value,
      },
    });
  };

  formDOM.files = function fillFiles(id, files) {
    ReactTestUtils.Simulate.change(this.getElement(id), {
      target: {
        files,
      },
    });
  };

  formDOM.submitForm = () => {
    if (form?.container) {
      fireEvent.submit(formDOM.querySelector('form'), {
        preventDefault: f => f,
      });
    } else {
      submitForm(form);
    }
  };

  formDOM.setCheckbox = function toggleCheckbox(selector, checked) {
    ReactTestUtils.Simulate.change(this.getElement(selector), {
      target: {
        checked,
      },
    });
  };

  formDOM.setYesNo = function setYesNo(selector, value) {
    const isYes =
      typeof value === 'string' ? value.toLowerCase() === 'y' : !!value;
    ReactTestUtils.Simulate.change(this.getElement(selector), {
      target: {
        value: isYes ? 'Y' : 'N',
      },
    });
  };

  formDOM.selectRadio = function selectRadioFn(fieldName, value) {
    ReactTestUtils.Simulate.change(
      this.getElement(`input[name*="${fieldName}"][value="${value}"]`),
      {
        target: { value },
      },
    );
  };

  formDOM.click = function click(selector) {
    ReactTestUtils.Simulate.click(this.getElement(selector));
  };

  formDOM.fillDate = function populateDate(partialId, dateString) {
    fillDate(this, partialId, dateString);
  };

  formDOM.printTree = function print() {
    printTree(this);
  };

  return formDOM;
}

export function fillData(form, selector, value) {
  form.find(selector).simulate('change', {
    target: {
      value,
    },
  });
}

export function selectCheckbox(form, fieldName, value) {
  form.find(`input[name*="${fieldName}"]`).simulate('change', {
    target: { checked: value },
  });
}

export function selectRadio(form, fieldName, value) {
  form
    .find(`input[name*="${fieldName}"][value="${value}"]`)
    .simulate('change', {
      target: { value },
    });
}

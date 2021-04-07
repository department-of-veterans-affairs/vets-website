import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';

export function getRadioOption(wrapper, optionName, radioName = '') {
  const queriedElements = wrapper.queryAllByRole('radio', { name: optionName });

  const radioButtonClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  const element =
    queriedElements.length === 1
      ? queriedElements[0]
      : queriedElements.find(queriedElement =>
          queriedElement.name.includes(radioName),
        );

  return {
    click: () => fireEvent.click(element, radioButtonClick),
  };
}

export function getLabelText(wrapper, labelText, fieldSetName = '') {
  const queriedElements = wrapper.queryAllByLabelText(labelText, {
    exact: false,
  });

  const element =
    queriedElements.length === 1
      ? queriedElements[0]
      : queriedElements.find(queriedElement =>
          queriedElement.name.includes(fieldSetName),
        ) || null;

  return {
    shouldExist: () => expect(element).to.not.be.null,
    shouldNotExist: () => expect(element).to.be.null,
    shouldBeRequired: () => expect(element).to.have.property('required'),
    change: value => fireEvent.change(element, { target: { value } }),
  };
}

export function getText(wrapper, text, fieldSetName = '') {
  const queriedElements = wrapper.queryAllByText(text, { exact: false });

  const element =
    queriedElements.length === 1
      ? queriedElements[0]
      : queriedElements.find(queriedElement =>
          queriedElement.for.includes(fieldSetName),
        ) || null;

  return {
    shouldExist: () => expect(element).to.not.be.null,
    shouldNotExist: () => expect(element).to.be.null,
    shouldBeRequired: () => expect(element).to.contain.text('Required'),
  };
}

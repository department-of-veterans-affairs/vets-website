import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ComboBox } from '../../components/ComboBox';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';

const items = Object.values(disabilityLabelsRevised);

describe('ComboBox', () => {
  let defaultProps = {};
  const onChangeSpy = sinon.spy();

  beforeEach(() => {
    // Reset default props before each test
    onChangeSpy.reset();
    defaultProps = {
      formData: '',
      uiSchema: {
        'ui:title': 'Test',
        'ui:options': {
          listItems: items,
        },
      },
      idSchema: { $id: '1' },
    };
  });

  it('should render with a hidden list', () => {
    const tree = render(<ComboBox {...defaultProps} />);
    // nothing typed, no items visible
    expect(tree.getByRole('listbox')).to.have.length(0);
  });

  // can't find the input element inside web-component shadowDOM
  // in order to test any other functionality here...
  // it('should handle keyboard input', async () => {
  //   const tree = render(<ComboBox {...defaultProps} />);
  //   expect(tree.getByRole('listbox')).to.have.length(0);
  //   const input = tree.getByLabelText('Test');
  //   await userEvent.type(input, 'acl', { skipClick: true });
  //   expect(tree.getByRole('listbox')).to.have.length(21);
  // });
});

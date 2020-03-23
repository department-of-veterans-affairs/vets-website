import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Vet360EditModal from '../../components/base/Vet360EditModal';

describe('<Vet360EditModal/>', () => {
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'some-field',
      clearErrors() {},
      getInitialFormValues() {},
      field: { value: {}, validations: {} },
      isEmpty() {},
      onBlur() {},
      onCancel() {},
      onChangeFormDataAndSchemas() {},
      onDelete() {},
      onSubmit() {},
      render: () => <div>Rendered output</div>,
      title: 'Edit Some Field',
      transactionRequest: null,
    };
  });

  it('renders with the correct props', () => {
    const initialFormValues = { someField: 'someFieldValue' };

    sinon.stub(props, 'getInitialFormValues').returns(initialFormValues);
    sinon.stub(props, 'onChangeFormDataAndSchemas');

    component = enzyme.shallow(<Vet360EditModal {...props} />);

    expect(
      props.onChangeFormDataAndSchemas.calledWith(initialFormValues),
      'onChange was called to initialize the modal with the result of getInitialFormValues',
    ).to.be.true;
    expect(
      component.html(),
      'The render prop was called and rendered into the component',
    ).to.contain('Rendered output');

    component.setProps({ field: null });
    expect(
      component.html(),
      'The render prop is not called when the field prop is falsey',
    ).to.not.contain('Rendered output');
    component.unmount();
  });
});

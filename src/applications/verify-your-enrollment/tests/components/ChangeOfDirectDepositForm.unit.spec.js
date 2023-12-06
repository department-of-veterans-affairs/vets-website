import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
// import sinon from 'sinon';
// import { mount } from 'enzyme';
import {
  getFormDOM,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';

import ChangeOfDirectDepositForm, {
  makeSchemas,
} from '../../components/ChangeOfDirectDepositForm';

const dummyProps = {
  title: 'TEST Direct Deposit Information',
  formChange: () => {},
  formData: {},
  formPrefix: 'test-',
  formSubmit: () => {},
};

const schemaObj = makeSchemas('test-schema-');

describe('Change Of Direct Deposit Form', () => {
  it('renders without crashing', () => {
    const wrapper = render(<ChangeOfDirectDepositForm {...dummyProps} />);
    expect(wrapper).to.be.not.null;
  });

  it('Should not submit blank form', () => {
    const screen = render(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schemaObj.schema}
        data={{}}
        formData={{}}
        uiSchema={schemaObj.uiSchema}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );
    const formDOM = getFormDOM(screen);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(6);
  });

  //   it('Should submit form', () => {
  //     const screen = render(
  //       <DefinitionTester
  //         pagePerItemIndex={0}
  //         schema={schemaObj.schema}
  //         data={{}}
  //         formData={{}}
  //         uiSchema={schemaObj.uiSchema}
  //         onChange={()=>{}}
  //         onSubmit={()=>{}}
  //     />,
  //     );
  //     const formDOM = getFormDOM(screen);
  //     formDOM.submitForm();

  //     expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(6);
  //   })
});

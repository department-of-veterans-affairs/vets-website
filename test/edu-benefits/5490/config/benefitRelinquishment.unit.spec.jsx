import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';

describe('Edu 5490 benefitRelinquishment', () => {
  const { schema, uiSchema } = formConfig.chapters.benefitSelection.pages.benefitRelinquishment;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          state={{
            benefitSelection: {
              uiSchema: {
                benefit: {
                  'ui:options': {
                  }
                }
              }
            }
          }}
          uiSchema={uiSchema}/>
    );
    const fields = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').concat(
      ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'select')
    );

    expect(fields.length).to.equal(3);
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          state={{
            benefitSelection: {
              uiSchema: {
                benefit: {
                  'ui:options': {
                  }
                }
              }
            }
          }}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).not.to.be.empty;
    expect(onSubmit.called).not.to.be.true;
  });

  it('should show no errors when all required fields are filled', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          state={{
            benefitSelection: {
              uiSchema: {
                benefit: {
                  'ui:options': {
                  }
                }
              }
            }
          }}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    ReactTestUtils.Simulate.change(find('#root_benefitsRelinquishedDateMonth'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(find('#root_benefitsRelinquishedDateDay'), {
      target: {
        value: 1
      }
    });
    ReactTestUtils.Simulate.change(find('#root_benefitsRelinquishedDateYear'), {
      target: {
        value: 1980
      }
    });

    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;
    expect(onSubmit.called).to.be.true;
  });
});

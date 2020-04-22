import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import moment from 'moment';
import sinon from 'sinon';
import formConfig from '../../config/form';

import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('526 verify BDD page', () => {
  const {
    depends,
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.verifyBdd;

  const futureDate = moment()
    .add(1, 'day')
    .format('YYYY-MM-DD');
  const formData = {
    serviceInformation: {
      servicePeriods: [
        {
          serviceBranch: 'Air force',
          dateRange: {
            from: '2009-12-31',
            to: futureDate,
          },
        },
        {
          serviceBranch: 'Army',
          dateRange: {
            from: '2004-02-12',
            to: futureDate,
          },
        },
      ],
    },
  };

  it('should show the page if there are active service periods', () => {
    expect(depends(formData)).to.be.true;
  });

  it('should hide the page if there are no active service periods', () => {
    expect(
      depends({
        serviceInformation: {
          serviceBranch: 'Air force',
          servicePeriods: [
            {
              dateRange: {
                from: '2009-12-31',
                to: '2010-12-31',
              },
            },
          ],
        },
      }),
    ).to.be.false;
  });

  it('should show the active service periods', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
      />,
    );

    const servicePeriodCards = form.find('.va-growable-background');
    expect(servicePeriodCards.length).to.equal(2);
    expect(servicePeriodCards.at(0).text()).to.contain('Air force');
    expect(servicePeriodCards.at(1).text()).to.contain('Army');

    form.unmount();
  });

  it('should submit with no information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });
});

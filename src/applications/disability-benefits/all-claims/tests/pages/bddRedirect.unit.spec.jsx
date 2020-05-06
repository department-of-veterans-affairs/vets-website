import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import moment from 'moment';
import { expect } from 'chai';

import createCommonStore from 'platform/startup/store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const defaultStore = createCommonStore();
const dateFormat = 'YYYY-MM-DD';

describe('526 bddRedirect page', () => {
  const {
    depends,
    uiSchema,
    schema,
  } = formConfig.chapters.veteranDetails.pages.bddRedirect;
  const formData = endDate => ({
    serviceInformation: {
      servicePeriods: [
        {
          serviceBranch: 'Air force',
          dateRange: {
            from: '2009-12-31',
            to: endDate,
          },
        },
      ],
    },
  });

  describe('depends', () => {
    it('should show up when there are active service periods', () => {
      const futureDate = moment()
        .add(1, 'day')
        .format(dateFormat);
      expect(depends(formData(futureDate))).to.be.true;
    });

    it('should not show up when there are no active service periods', () => {
      expect(depends(formData('2010-01-01'))).to.be.false;
    });
  });

  it('should show the right content when the separation date is < 90 days in the future', () => {
    const tree = mount(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData(
            moment()
              .add(1, 'days')
              .format(dateFormat),
          )}
        />
      </Provider>,
    );

    expect(tree.text()).to.contain(
      'Your separation date is in less than 90 days',
    );

    tree.unmount();
  });

  it('should show the right content when the separation date is between 90 and 180 days in the future', () => {
    const ninetyDays = mount(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData(
            moment()
              .add(90, 'days')
              .format(dateFormat),
          )}
        />
      </Provider>,
    );
    const oneEightyDays = mount(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={formData(
            moment()
              .add(180, 'days')
              .format(dateFormat),
          )}
        />
      </Provider>,
    );

    expect(ninetyDays.text()).to.contain(
      'Your separation date is in the next 90 to 180 days',
    );
    expect(oneEightyDays.text()).to.contain(
      'Your separation date is in the next 90 to 180 days',
    );

    ninetyDays.unmount();
    oneEightyDays.unmount();
  });

  it('should show the right content when the separation date is > 180 days in the future', () => {
    const tree = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData(
          moment()
            .add(181, 'days')
            .format(dateFormat),
        )}
      />,
    );

    const text = tree.text();
    expect(text).to.contain('You can’t file a disability claim right now');
    expect(text).to.contain(
      'You can’t file a disability claim until 180 days before you leave the service.',
    );
    expect(text).to.not.contain('You’re still in the service');

    tree.unmount();
  });
});

import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ObjectField from 'platform/forms-system/src/js/fields/ObjectField';

import DemographicViewField from '../../components/FormFields/DemographicViewField';
import formConfig from '../../config/form';

describe('hca <DemographicViewField>', () => {
  it('should render ObjectField', () => {
    const formContext = {
      reviewMode: false,
    };
    const registry = {
      fields: {
        ObjectField,
      },
      definitions: {},
      widgets: {},
      formContext,
    };

    const tree = SkinDeep.shallowRender(
      <DemographicViewField
        formContext={formContext}
        onChange={f => f}
        registry={registry}
        schema={{}}
      />,
    );

    expect(tree.subTree('ObjectField')).not.to.be.false;
    expect(tree.subTree('ObjectField').props.formContext).to.equal(formContext);
  });
  it('should render review version', () => {
    const formContext = {
      reviewMode: true,
    };
    const registry = {
      fields: {
        ObjectField,
      },
      definitions: {},
      widgets: {},
      formContext,
    };
    const {
      demographicInformation,
    } = formConfig.chapters.veteranInformation.pages;

    const tree = SkinDeep.shallowRender(
      <DemographicViewField
        formContext={formContext}
        onChange={f => f}
        schema={
          demographicInformation.schema.properties['view:demographicCategories']
        }
        uiSchema={demographicInformation.uiSchema['view:demographicCategories']}
        formData={{
          isAsian: true,
          isSpanishHispanicLatino: true,
        }}
        registry={registry}
      />,
    );

    const reviewRows = tree.everySubTree('.review-row');

    expect(reviewRows[0].subTree('dt').text()).to.equal(
      demographicInformation.uiSchema['view:demographicCategories']['ui:title'],
    );
    expect(reviewRows[0].subTree('dd').text()).to.equal(
      demographicInformation.uiSchema['view:demographicCategories'].isAsian[
        'ui:title'
      ],
    );
    expect(reviewRows[1].subTree('dd').text()).to.equal(
      demographicInformation.uiSchema['view:demographicCategories']
        .isSpanishHispanicLatino['ui:title'],
    );
  });
});

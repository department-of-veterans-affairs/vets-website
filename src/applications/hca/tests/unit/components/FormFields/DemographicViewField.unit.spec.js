import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ObjectField from '@department-of-veterans-affairs/platform-forms-system/ObjectField';
import DemographicViewField from '../../../../components/FormFields/DemographicViewField';
import formConfig from '../../../../config/form';

describe('hca <DemographicViewField>', () => {
  context('when `reviewMode` is `false`', () => {
    const formContext = { reviewMode: false };
    const props = {
      formContext,
      registry: {
        fields: {
          ObjectField,
        },
        definitions: {},
        widgets: {},
        formContext,
      },
      onChange: f => f,
      schema: {},
    };

    it('should render ObjectField', () => {
      const tree = SkinDeep.shallowRender(<DemographicViewField {...props} />);
      const selector = tree.subTree('ObjectField');
      expect(selector).not.to.be.false;
      expect(selector.props.formContext).to.equal(formContext);
    });

    it('should not render review rows', () => {
      const tree = SkinDeep.shallowRender(<DemographicViewField {...props} />);
      const selector = tree.everySubTree('.review-row');
      expect(selector).have.lengthOf(0);
    });
  });

  context('when `reviewMode` is `true`', () => {
    const formContext = { reviewMode: true };
    const {
      demographicInformation,
    } = formConfig.chapters.veteranInformation.pages;
    const { schema, uiSchema } = demographicInformation;
    const defaultProps = {
      formContext,
      registry: {
        fields: {
          ObjectField,
        },
        definitions: {},
        widgets: {},
        formContext,
      },
      onChange: f => f,
      schema: schema.properties['view:demographicCategories'],
      uiSchema: uiSchema['view:demographicCategories'],
    };

    describe('when no values have been selected', () => {
      const props = {
        ...defaultProps,
        formData: { isSpanishHispanicLatino: false },
      };

      it('should not render ObjectField', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.subTree('ObjectField');
        expect(selector).to.be.false;
      });

      it('should render correct number of review rows', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        const dataKeys = Object.keys(props.formData);
        expect(selector).to.have.lengthOf(dataKeys.length);
      });

      it('should render the title attribute', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        selector.forEach((item, index) => {
          if (index === 0) {
            expect(item.subTree('dt').text()).to.equal(
              uiSchema['view:demographicCategories']['ui:title'],
            );
          } else {
            expect(item.subTree('dt').text()).to.be.empty;
          }
        });
      });

      it('should not render any item labels', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        selector.forEach(item => {
          expect(item.subTree('dd').text()).to.be.empty;
        });
      });
    });

    describe('when values have been selected', () => {
      const props = {
        ...defaultProps,
        formData: {
          isAsian: true,
          isSpanishHispanicLatino: true,
        },
      };

      it('should not render ObjectField', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.subTree('ObjectField');
        expect(selector).to.be.false;
      });

      it('should render correct number of review rows', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        const dataKeys = Object.keys(props.formData);
        expect(selector).to.have.lengthOf(dataKeys.length);
      });

      it('should render the title attribute to the first review row only', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        selector.forEach((item, index) => {
          if (index === 0) {
            expect(item.subTree('dt').text()).to.equal(
              uiSchema['view:demographicCategories']['ui:title'],
            );
          } else {
            expect(item.subTree('dt').text()).to.be.empty;
          }
        });
      });

      it('should render the correct item labels based on form data', () => {
        const tree = SkinDeep.shallowRender(
          <DemographicViewField {...props} />,
        );
        const selector = tree.everySubTree('.review-row');
        const dataKeys = Object.keys(props.formData);
        selector.forEach((item, index) => {
          expect(item.subTree('dd').text()).to.equal(
            uiSchema['view:demographicCategories'][dataKeys[index]]['ui:title'],
          );
        });
      });
    });
  });
});

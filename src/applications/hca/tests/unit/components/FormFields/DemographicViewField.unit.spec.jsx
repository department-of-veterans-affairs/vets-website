import React from 'react';
import { expect } from 'chai';
<<<<<<< HEAD
import SkinDeep from 'skin-deep';
import ObjectField from 'platform/forms-system/src/js/fields/ObjectField';
=======
import { render } from '@testing-library/react';
>>>>>>> main
import DemographicViewField from '../../../../components/FormFields/DemographicViewField';
import formConfig from '../../../../config/form';

describe('hca <DemographicViewField>', () => {
<<<<<<< HEAD
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
=======
  const subject = ({ formData = {}, reviewMode = true } = {}) => {
    const { pages } = formConfig.chapters.veteranInformation;
    const { schema, uiSchema } = pages.demographicInformation;
    const name = 'view:demographicCategories';
    const props = {
      formData,
      formContext: { reviewMode },
      registry: {
        fields: {
          ObjectField: () => <fieldset className="rjsf-object-field" />,
        },
      },
      schema: schema.properties[name],
      uiSchema: uiSchema[name],
    };
    const { container } = render(<DemographicViewField {...props} />);
    const selectors = () => ({
      reviewRows: container.querySelectorAll('.review-row'),
      objectField: container.querySelector('.rjsf-object-field'),
    });
    return { selectors, uiSchema: props.uiSchema };
  };

  it('should render `ObjectField` component when `reviewMode` is `false`', () => {
    const { selectors } = subject({ reviewMode: false });
    const { objectField, reviewRows } = selectors();
    expect(objectField).to.exist;
    expect(reviewRows).to.not.have.length;
  });

  it('should render review rows when `reviewMode` is `true`', () => {
    const { selectors } = subject({
      formData: { isSpanishHispanicLatino: false },
    });
    const { objectField, reviewRows } = selectors();
    expect(objectField).to.not.exist;
    expect(reviewRows).to.have.lengthOf(1);
  });

  it('should render correct review row data when no data values have been selected', () => {
    const { selectors, uiSchema } = subject({
      formData: { isSpanishHispanicLatino: false },
    });
    const { reviewRows } = selectors();
    const defaultTitle = reviewRows[0].querySelector('dt');
    const defaultLabel = reviewRows[0].querySelector('dd');
    expect(defaultTitle.textContent).to.eq(uiSchema['ui:title']);
    expect(defaultLabel).to.be.empty;
  });

  it('should render correct review row data when data values have been selected', () => {
    const formData = { isAsian: true, isSpanishHispanicLatino: true };
    const dataKeys = Object.keys(formData);
    const { selectors, uiSchema } = subject({ formData });
    const { reviewRows } = selectors();
    reviewRows.forEach((item, index) => {
      const itemLabel = uiSchema[dataKeys[index]]['ui:title'];
      expect(item.querySelector('dd').textContent).to.eq(itemLabel);
>>>>>>> main
    });
  });
});

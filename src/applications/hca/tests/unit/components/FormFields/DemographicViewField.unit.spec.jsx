import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DemographicViewField from '../../../../components/FormFields/DemographicViewField';
import formConfig from '../../../../config/form';

describe('hca <DemographicViewField>', () => {
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
    });
  });
});

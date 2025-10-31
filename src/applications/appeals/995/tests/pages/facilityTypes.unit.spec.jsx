import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon-v20';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import {
  facilityTypeChoices,
  facilityTypeList,
  facilityTypeReviewField as ReviewField,
} from '../../content/facilityTypes';

describe('Supplemental Claims option for facility type page', () => {
  const { schema, uiSchema } = formConfig.chapters.evidence.pages.facilityTypes;
  let onSubmit;

  beforeEach(() => {
    onSubmit = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  const renderContainer = (data = {}, formData = {}) => {
    return render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={formData}
        onSubmit={onSubmit}
      />,
    );
  };

  describe('initial render', () => {
    it('should render with correct structure and attributes', () => {
      const { container } = renderContainer();

      const group = $('va-checkbox-group', container);
      expect(group).to.exist;
      expect(group.getAttribute('required')).to.eq('true');
      expect(group.getAttribute('label-header-level')).to.eq('3');
    });

    it('should render all 6 facility type checkboxes', () => {
      const { container } = renderContainer();
      const checkboxes = $$('va-checkbox', container);

      expect(checkboxes.length).to.eq(6);
    });

    it('should have no checkboxes selected by default', () => {
      const { container } = renderContainer();
      const checkedBoxes = $$('va-checkbox[checked]', container);

      expect(checkedBoxes.length).to.eq(0);
    });

    it('should not show error on initial render', () => {
      const { container } = renderContainer();

      expect($('va-checkbox-group[error]', container)).to.not.exist;
    });
  });

  describe('validation', () => {
    it('should show error when submitting without selecting any options', async () => {
      const { container } = renderContainer();

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.exist;
        expect(onSubmit.called).to.be.false;
      });
    });

    it('should clear error when a checkbox is selected after validation error', async () => {
      const { container } = renderContainer();

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.exist;
      });

      const checkbox = $('va-checkbox', container);

      fireEvent(
        checkbox,
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.not.exist;
      });
    });
  });

  describe('checkbox selection and submission', () => {
    it('should submit when vamc checkbox is checked', async () => {
      const { container } = renderContainer({ facilityTypes: { vamc: true } });

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.not.exist;
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should submit when multiple checkboxes are checked', async () => {
      const { container } = renderContainer({
        facilityTypes: { vamc: true, ccp: true, nonVa: true },
      });

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.not.exist;
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should submit when the "other" input is filled', async () => {
      const { container } = renderContainer({
        facilityTypes: { other: 'test' },
      });

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        expect($('va-checkbox-group[error]', container)).to.not.exist;
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should persist selected checkboxes in form data', () => {
      const { container } = renderContainer({
        facilityTypes: { vamc: true, ccp: true },
      });
      const checkedBoxes = $$('va-checkbox[checked]', container);

      expect(checkedBoxes.length).to.eq(2);
    });
  });

  describe('user interaction', () => {
    it('should handle checking and unchecking a checkbox', async () => {
      const { container } = renderContainer();
      const checkbox = $('va-checkbox', container);

      fireEvent(
        checkbox,
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect(checkbox.hasAttribute('checked')).to.be.true;
      });

      fireEvent(
        checkbox,
        new CustomEvent('vaChange', {
          detail: { checked: false },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        const checkedBoxes = $$('va-checkbox[checked]', container);
        expect(checkedBoxes.length).to.eq(0);
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper label header level for screen readers', () => {
      const { container } = renderContainer();
      const group = $('va-checkbox-group', container);

      expect(group.getAttribute('label-header-level')).to.eq('3');
    });

    it('should indicate required field with attribute', () => {
      const { container } = render(
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      const group = $('va-checkbox-group', container);
      expect(group.getAttribute('required')).to.eq('true');
    });

    it('should show error message when validation fails', async () => {
      const { container } = renderContainer();

      fireEvent.click($('button[type="submit"]', container));

      await waitFor(() => {
        const groupWithError = $('va-checkbox-group[error]', container);
        expect(groupWithError).to.exist;
        expect(groupWithError.getAttribute('error')).to.exist;
      });
    });
  });
});

describe('facilityTypeList', () => {
  it('should return single choice text', () => {
    const data = { vamc: true };
    expect(facilityTypeList(data)).to.eq(facilityTypeChoices.vamc);
  });

  it('should return readable list for two choices', () => {
    const data = { ccp: true, nonVa: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );

    expect(facilityTypeList(data)).to.eq(result);
  });

  it('should return readable list for multiple choices', () => {
    const data = { vetCenter: true, cboc: true, mtf: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );

    expect(facilityTypeList(data)).to.eq(result);
  });

  it('should handle unknown choice gracefully', () => {
    const data = { vamc: true, other: 'testing', other2: true };
    const result = `${
      facilityTypeChoices.vamc
    }, testing, and Unknown facility type choice`;
    expect(facilityTypeList(data)).to.eq(result);
  });

  it('should return empty string for empty object', () => {
    const data = {};
    expect(facilityTypeList(data)).to.eq('');
  });

  it('should handle null or undefined gracefully', () => {
    expect(facilityTypeList(null)).to.exist;
    expect(facilityTypeList(undefined)).to.exist;
  });

  it('should include custom "other" text when provided', () => {
    const data = { vamc: true, other: 'Custom facility name' };
    const result = facilityTypeList(data);

    expect(result).to.contain('Custom facility name');
    expect(result).to.contain(facilityTypeChoices.vamc);
  });
});

describe('facilityTypeReviewField', () => {
  it('should render single choice in review field', () => {
    const data = { vamc: true };
    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(facilityTypeChoices.vamc);
  });

  it('should render readable list for two choices in review field', () => {
    const data = { ccp: true, nonVa: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );

    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(result);
  });

  it('should render readable list for multiple choices in review field', () => {
    const data = { vetCenter: true, cboc: true, mtf: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );

    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(result);
  });

  it('should handle unknown choice in review field', () => {
    const data = { vamc: true, other: 'testing', other2: true };
    const result = `${
      facilityTypeChoices.vamc
    }, testing, and Unknown facility type choice`;

    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(result);
  });

  it('should render with proper semantic HTML structure', () => {
    const data = { vamc: true };
    const { container } = render(<ReviewField formData={data} />);

    expect($('dt', container)).to.exist;
    expect($('dd', container)).to.exist;
  });

  it('should handle empty data gracefully in review field', () => {
    const { container } = render(<ReviewField formData={{}} />);

    expect($('dd', container)).to.exist;
  });

  it('should display custom "other" text in review field', () => {
    const data = { other: 'My custom facility' };
    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.contain('My custom facility');
  });
});

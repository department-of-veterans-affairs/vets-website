import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  inputVaTextInput,
  checkVaCheckbox,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  officialReport,
  officialReportMst,
} from '../../../pages/form0781/officialReport';
import {
  officialReportPageTitle,
  militaryReportsHint,
  otherReportsHint,
  otherReportTypesTitle,
  selectedReportTypes,
  showConflictingAlert,
  validateReportSelections,
} from '../../../content/officialReport';
import {
  OFFICIAL_REPORT_TYPES_SUBTITLES,
  MILITARY_REPORT_TYPES,
  OTHER_REPORT_TYPES,
  NO_REPORT_TYPE,
} from '../../../constants';

describe('Official report without MST event type', () => {
  const { schema, uiSchema } = officialReport;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.a('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.a('object');
  });

  it('should render only other and no report type checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    expect(getByText(officialReportPageTitle)).to.exist;

    expect($$('va-checkbox-group', container).length).to.equal(2);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      OFFICIAL_REPORT_TYPES_SUBTITLES.other,
    );
    expect($('va-checkbox-group', container).getAttribute('hint')).to.equal(
      otherReportsHint,
    );

    Object.values(OTHER_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(NO_REPORT_TYPE).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(MILITARY_REPORT_TYPES).forEach(option => {
      expect($(`va-checkbox[label="${option}"]`, container)).to.be.null;
    });
  });

  it('should render optional unlisted report type field', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    expect(getByText(officialReportPageTitle)).to.exist;

    const textInputs = container.querySelectorAll('va-text-input');
    expect(textInputs.length).to.eq(1);

    const otherReportTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === otherReportTypesTitle,
    );
    expect(otherReportTextInput).to.not.be.null;
    expect(otherReportTextInput.getAttribute('required')).to.eq('false');
  });

  it('should submit without selecting any report types', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more report types are selected', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'restricted');
    checkVaCheckbox(checkboxGroup, 'police');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});

describe('Official Report with MST event type', () => {
  const { schema, uiSchema } = officialReportMst;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.a('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.a('object');
  });

  it('should render military, other and no report type checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    expect(getByText(officialReportPageTitle)).to.exist;

    expect($$('va-checkbox-group', container).length).to.equal(3);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      OFFICIAL_REPORT_TYPES_SUBTITLES.military,
    );
    expect($('va-checkbox-group', container).getAttribute('hint')).to.equal(
      militaryReportsHint,
    );

    Object.values(MILITARY_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(OTHER_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(NO_REPORT_TYPE).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('should render optional unlisted report type field', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    expect(getByText(officialReportPageTitle)).to.exist;

    const textInputs = container.querySelectorAll('va-text-input');
    expect(textInputs.length).to.eq(1);

    const otherReportTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === otherReportTypesTitle,
    );
    expect(otherReportTextInput).to.not.be.null;
    expect(otherReportTextInput.getAttribute('required')).to.eq('false');
  });

  it('should submit without selecting any report types', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more report types are selected', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'restricted');
    checkVaCheckbox(checkboxGroup, 'police');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});

describe('Report Selection Validation', () => {
  describe('selectedReportTypes', () => {
    it('should correctly identify selected report types', () => {
      const formData = {
        militaryReports: { restricted: true, unrestricted: false },
        otherReports: { police: true, unsure: false },
        unlistedReport: 'Some unlisted report',
      };

      const result = selectedReportTypes(formData);
      expect(result).to.deep.equal({
        militaryReports: true,
        otherReports: true,
        unlistedReport: true,
      });
    });

    it('should return false for all when no reports are selected', () => {
      const formData = {
        militaryReports: {},
        otherReports: { none: true },
        unlistedReport: '',
      };

      const result = selectedReportTypes(formData);
      expect(result).to.deep.equal({
        militaryReports: false,
        otherReports: false,
        unlistedReport: false,
      });
    });
  });

  describe('showConflictingAlert', () => {
    it('should return true when "no report filed" is selected along with other reports', () => {
      const formData = {
        noReport: { none: true },
        militaryReports: { restricted: true },
      };
      expect(showConflictingAlert(formData)).to.be.true;
    });

    it('should return false when only "no report filed" is selected', () => {
      const formData = {
        noReport: { none: true },
        militaryReports: {},
        otherReports: {},
        unlistedReport: '',
      };
      expect(showConflictingAlert(formData)).to.be.false;
    });

    it('should return false when "no report filed" is not selected and reports are selected', () => {
      const formData = {
        noReport: { none: false },
        militaryReports: { restricted: true },
        otherReports: { none: true },
      };
      expect(showConflictingAlert(formData)).to.be.false;
    });
  });

  describe('validateReportSelections', () => {
    let errors;

    beforeEach(() => {
      errors = {
        noReport: { addError: sinon.spy() },
      };
    });

    it('should add an error if conflicting selections exist', () => {
      const formData = {
        noReport: { none: true },
        militaryReports: { restricted: true },
      };

      validateReportSelections(errors, formData);

      expect(errors.noReport.addError.calledOnce).to.be.true;
    });

    it('should not add an error if no conflict exists', () => {
      const formData = {
        noReport: { none: true },
        militaryReports: {},
        otherReports: { unsure: false },
        unlistedReport: '',
      };

      validateReportSelections(errors, formData);

      expect(errors.noReport.addError.called).to.be.false;
    });
  });
});

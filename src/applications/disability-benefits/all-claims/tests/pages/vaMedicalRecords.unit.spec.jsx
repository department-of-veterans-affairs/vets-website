import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { form0781WorkflowChoices } from '../../content/form0781/workflowChoices';
import { formatMonthYearDate } from '../../utils/dates';

describe('VA Medical Records', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.vaMedicalRecords;
  const claimType = {
    'view:claimType': {
      'view:claimingIncrease': true,
      'view:claimingNew': false,
    },
  };
  const newClaimTypeOnly = {
    'view:claimType': {
      'view:claimingNew': true,
    },
  };
  const ratedDisabilities = [
    {
      name: 'Post traumatic stress disorder',
      'view:selected': true,
    },
    {
      name: 'Intervertebral disc syndrome',
      'view:selected': true,
    },
    {
      name: 'Diabetes Melitus',
      'view:selected': true,
    },
  ];

  const newDisabilities = [
    {
      cause: 'NEW',
      condition: 'asthma',
      'view:descriptionInfo': {},
    },
  ];

  it('should render with rated disabilities', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(3); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(3);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
  });

  it('should render with rated disabilities and new conditions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': true,
          },
          newDisabilities,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(3); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(4);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
  });

  describe('0781 question', () => {
    it('should render with 0781 questions when feature is enabled, user opted into 0781, and has new disabilites', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...newClaimTypeOnly,
            newDisabilities,
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
            syncModern0781Flow: true,
            mentalHealthWorkflowChoice:
              form0781WorkflowChoices.COMPLETE_ONLINE_FORM, // Opt in/out
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(1); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
      form.unmount();
    });

    it('should not render with 0781 questions when feature is enabled, and the user did opt out of 0781, and has new disabilites', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...newClaimTypeOnly,
            newDisabilities,
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
            syncModern0781Flow: true,
            mentalHealthWorkflowChoice:
              form0781WorkflowChoices.OPT_OUT_OF_FORM0781, // Opt in/out
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
      form.unmount();
    });

    it('should not render with 0781 questions when feature is disabled', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...newClaimTypeOnly,
            newDisabilities,
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
            syncModern0781Flow: false,
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
      form.unmount();
    });

    it('should not render with 0781 questions when it is a claim for increase only', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
            syncModern0781Flow: false,
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(3); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
      form.unmount();
    });
  });

  // Ignore empty vaTreatmentFacilities when not selected, see
  // va.gov-team/issues/34289
  it('should allow submit if VA medical records not selected', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': false,
          },
          vaTreatmentFacilities: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  it('should not submit without all required info', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      // Required field: Facility name
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(
        form.find(
          'va-checkbox-group[error="Please select at least one condition"]',
        ).length,
      ).to.equal(1);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should require military city when military state selected', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'AA',
              },
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should require military state when military city entered', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'APO',
                state: 'VA',
              },
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  describe('treatmentDateRange comprehensive date validation', () => {
    it('should not submit when treatment start date precedes service start date', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2001-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                { serviceBranch: 'Army', dateRange: { from: '2012-01-12' } },
                { serviceBranch: 'Navy', dateRange: { from: '2001-06-30' } },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });

    it('should submit when treatment start date equals service start date', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2001-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                { dateRange: { from: '2012-01-12' }, serviceBranch: 'Army' },
                { dateRange: { from: '2001-05-30' }, serviceBranch: 'Army' },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });

    it('should submit when treatment start date year without month equals earliest service start date year', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2001-XX-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                { dateRange: { from: '2012-01-12' }, serviceBranch: 'Army' },
                { dateRange: { from: '2001-05-30' }, serviceBranch: 'Army' },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });

    it('should not submit when treatment start date includes a month but no year', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: 'XXXX-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                { serviceBranch: 'Army', dateRange: { from: '2012-01-12' } },
                { serviceBranch: 'Navy', dateRange: { from: '2001-06-30' } },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });

    it('should not submit when treatment start date is in the future', async () => {
      const onSubmit = sinon.spy();
      const futureDate = formatMonthYearDate(
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
      );
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: futureDate,
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                { serviceBranch: 'Army', dateRange: { from: '2012-01-12' } },
                { serviceBranch: 'Navy', dateRange: { from: '2001-06-30' } },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );
      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });

    it('should accept valid treatment date range', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Test clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2010-04-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });

    it('should handle year-only date (YYYY-XX-XX)', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Test clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2010-XX-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });

    it('should accept null treatment date', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Test clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: null, // Null date - not required
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });

    it('should validate multiple treatment facilities with different date scenarios', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Clinic A',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                },
                treatmentDateRange: {
                  from: '2010-04-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
              {
                treatmentCenterName: 'Clinic B',
                treatedDisabilityNames: {
                  intervertebraldiscsyndrome: true,
                },
                treatmentDateRange: {
                  from: '2011-XX-XX', // Partial date
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Richmond',
                  state: 'VA',
                },
              },
            ],
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.calledOnce).to.be.true;
        form.unmount();
      });
    });
  });

  describe('confirmation page display formatting', () => {
    describe('treatment date confirmation field', () => {
      const confirmationField =
        uiSchema.vaTreatmentFacilities.items.treatmentDateRange.from[
          'ui:confirmationField'
        ];

      it('formats partial dates with XX placeholders as readable month/year', () => {
        const result = confirmationField({ formData: '2008-01-XX' });
        expect(result.data).to.equal('January 2008');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('displays "Unknown" for missing or empty dates', () => {
        expect(confirmationField({ formData: null }).data).to.equal('Unknown');
        expect(confirmationField({ formData: undefined }).data).to.equal(
          'Unknown',
        );
        expect(confirmationField({ formData: '' }).data).to.equal('Unknown');
      });

      it('formats complete dates as full date with day', () => {
        const result = confirmationField({ formData: '2010-04-01' });
        expect(result.data).to.equal('April 1, 2010');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('formats year-only dates when month is XX', () => {
        const result = confirmationField({ formData: '2010-XX-XX' });
        expect(result.data).to.equal('2010');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('formats year-only dates when month is XX', () => {
        const result = confirmationField({ formData: '2015-XX-XX' });
        expect(result.data).to.equal('2015');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('formats month-year dates when day is XX', () => {
        const result = confirmationField({ formData: '2020-12-XX' });
        expect(result.data).to.equal('December 2020');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('handles different valid months correctly', () => {
        expect(confirmationField({ formData: '2021-02-XX' }).data).to.equal(
          'February 2021',
        );
        expect(confirmationField({ formData: '2021-06-XX' }).data).to.equal(
          'June 2021',
        );
        expect(confirmationField({ formData: '2021-11-XX' }).data).to.equal(
          'November 2021',
        );
      });

      it('formats full dates with day correctly', () => {
        expect(confirmationField({ formData: '2021-02-15' }).data).to.equal(
          'February 15, 2021',
        );
        expect(confirmationField({ formData: '2021-06-05' }).data).to.equal(
          'June 5, 2021',
        );
        expect(confirmationField({ formData: '2021-11-22' }).data).to.equal(
          'November 22, 2021',
        );
      });

      it('returns Unknown for invalid year (XXXX)', () => {
        const result = confirmationField({ formData: 'XXXX-01-01' });
        expect(result.data).to.equal('Unknown');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('returns Unknown for completely unknown date', () => {
        const result = confirmationField({ formData: 'XXXX-XX-XX' });
        expect(result.data).to.equal('Unknown');
        expect(result.label).to.equal(
          'When did you first visit this facility?',
        );
      });

      it('handles edge case with non-string input types', () => {
        expect(confirmationField({ formData: 123 }).data).to.equal('Unknown');
        expect(confirmationField({ formData: {} }).data).to.equal('Unknown');
        expect(confirmationField({ formData: [] }).data).to.equal('Unknown');
      });
    });

    describe('traumatic event treatment confirmation field', () => {
      const confirmationField =
        uiSchema.vaTreatmentFacilities.items.treatmentLocation0781Related[
          'ui:confirmationField'
        ];

      it('displays "Yes" or "No" based on boolean response', () => {
        const resultTrue = confirmationField({ formData: true });
        expect(resultTrue.data).to.equal('Yes');
        expect(resultTrue.label).to.equal(
          'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        );

        const resultFalse = confirmationField({ formData: false });
        expect(resultFalse.data).to.equal('No');
        expect(resultFalse.label).to.equal(
          'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
        );
      });
    });
  });

  describe('treatedDisabilityNames validation', () => {
    it('should submit when treatedDisabilityNames contains a known rated disability', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  diabetesmelitus: true,
                  intervertebraldiscsyndrome: true,
                },
                treatmentDateRange: {
                  from: '2015-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                {
                  dateRange: { from: '2012-01-12' },
                  serviceBranch: 'Coast Guard',
                },
                {
                  dateRange: { from: '2001-05-30' },
                  serviceBranch: 'Coast Guard',
                },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(0);
        expect(onSubmit.called).to.be.true;
        form.unmount();
      });
    });

    it('should not submit when treatedDisabilityNames is not a subset of the known disabilities', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {
                  loremipsumdolor: true, // this does not map to any of the rated disabilities
                },
                treatmentDateRange: {
                  from: '2015-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                {
                  dateRange: { from: '2012-01-12' },
                  serviceBranch: 'Coast Guard',
                },
                {
                  dateRange: { from: '2001-05-30' },
                  serviceBranch: 'Coast Guard',
                },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });

    it('should not submit when treatedDisabilityNames is empty', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatedDisabilityNames: {},
                treatmentDateRange: {
                  from: '2015-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                {
                  dateRange: { from: '2012-01-12' },
                  serviceBranch: 'Coast Guard',
                },
                {
                  dateRange: { from: '2001-05-30' },
                  serviceBranch: 'Coast Guard',
                },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });

    it('should not submit when treatedDisabilityNames is not present', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            ...claimType,
            ratedDisabilities,
            vaTreatmentFacilities: [
              {
                treatmentCenterName: 'Sommerset VA Clinic',
                treatmentDateRange: {
                  from: '2015-05-XX',
                },
                treatmentCenterAddress: {
                  country: 'USA',
                  city: 'Sommerset',
                  state: 'VA',
                },
              },
            ],
            serviceInformation: {
              servicePeriods: [
                {
                  dateRange: { from: '2012-01-12' },
                  serviceBranch: 'Coast Guard',
                },
                {
                  dateRange: { from: '2001-05-30' },
                  serviceBranch: 'Coast Guard',
                },
              ],
            },
          }}
          onSubmit={onSubmit}
        />,
      );

      await waitFor(() => {
        form.find('form').simulate('submit');
        expect(form.find('.usa-input-error-message').length).to.equal(1);
        expect(onSubmit.called).to.be.false;
        form.unmount();
      });
    });
  });
});

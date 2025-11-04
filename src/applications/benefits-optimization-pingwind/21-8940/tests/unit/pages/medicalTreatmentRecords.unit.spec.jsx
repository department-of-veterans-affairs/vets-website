import { expect } from 'chai';
import medicalTreatmentRecordsPages from '../../../pages/medicalTreatmentRecords';
import { DateRangeView } from '../../../components/viewElements';

const pages = medicalTreatmentRecordsPages;

describe('8940 medicalTreatmentRecords array builder pages', () => {
  it('registers the expected page keys with correct paths', () => {
    expect(Object.keys(pages)).to.have.members([
      'medicalTreatmentRecordsIntro',
      'medicalTreatmentRecordsSummary',
      'medicalTreatmentRecordsDoctorPage',
      'medicalTreatmentRecordsHospitalPage',
      'medicalTreatmentRecordsTreatmentDatesPage',
      'medicalTreatmentRecordsHospitalizationDatesPage',
    ]);

    expect(pages.medicalTreatmentRecordsIntro.path).to.equal(
      'medical-treatment-records',
    );
    expect(pages.medicalTreatmentRecordsSummary.path).to.equal(
      'medical-treatment-records-summary',
    );
    expect(pages.medicalTreatmentRecordsDoctorPage.path).to.equal(
      'medical-treatment-records/:index/doctor-information',
    );
    expect(pages.medicalTreatmentRecordsHospitalPage.path).to.equal(
      'medical-treatment-records/:index/hospital-information',
    );
    expect(pages.medicalTreatmentRecordsTreatmentDatesPage.path).to.equal(
      'medical-treatment-records/:index/treatment-dates',
    );
    expect(pages.medicalTreatmentRecordsHospitalizationDatesPage.path).to.equal(
      'medical-treatment-records/:index/hospitalization-dates',
    );
  });

  describe('summary page configuration', () => {
    const summary = pages.medicalTreatmentRecordsSummary;

    it('requires answers for records and non-VA treatment', () => {
      expect(summary.schema.required).to.include(
        'view:hasMedicalTreatmentRecords',
      );
      expect(summary.schema.required).to.include('view:treatmentAtNonVA');
    });

    it('uses array builder yes/no UI for the primary question', () => {
      const hasRecordsUi = summary.uiSchema['view:hasMedicalTreatmentRecords'];
      expect(hasRecordsUi['ui:widget']).to.equal('yesNo');
      expect(hasRecordsUi['ui:validations']).to.be.an('array').that.is.not
        .empty;

      const nonVaUi = summary.uiSchema['view:treatmentAtNonVA'];
      expect(nonVaUi['ui:widget']).to.equal('yesNo');
      expect(nonVaUi['ui:errorMessages'].required).to.equal(
        'Please select if you were treated at a Non-VA hospital.',
      );
    });

    it('exposes the non-VA authorization info behind a conditional panel', () => {
      const nonVaInfoUi = summary.uiSchema['view:nonVAAuthorizationInfo'];
      expect(typeof nonVaInfoUi['ui:description']).to.equal('function');
      expect(nonVaInfoUi['ui:options'].expandUnder).to.equal(
        'view:treatmentAtNonVA',
      );
      expect(nonVaInfoUi['ui:options'].expandUnderCondition).to.be.true;
    });
  });

  describe('doctor information item page', () => {
    const doctorPage = pages.medicalTreatmentRecordsDoctorPage;

    it('limits the array to four medical treatment records', () => {
      const recordsSchema =
        doctorPage.schema.properties.medicalTreatmentRecords;
      expect(recordsSchema.maxItems).to.equal(4);
    });

    it('captures doctor name details with the expected labeling', () => {
      const doctorItemUi = doctorPage.uiSchema.medicalTreatmentRecords.items;
      expect(doctorItemUi.doctorName['ui:title']).to.equal(
        'Name of doctor (if applicable)',
      );
      expect(doctorItemUi.doctorName['ui:options'].hint).to.equal(
        'Leave blank if you were not treated by a specific doctor',
      );
    });

    it('omits street3 from the doctor address schema', () => {
      const doctorItemSchema =
        doctorPage.schema.properties.medicalTreatmentRecords.items;
      expect(doctorItemSchema.properties.doctorAddress.properties.street3).to.be
        .undefined;
    });
  });

  describe('treatment dates item page', () => {
    const treatmentPage = pages.medicalTreatmentRecordsTreatmentDatesPage;

    it('allows at most two treatment date ranges per record', () => {
      const treatmentSchema =
        treatmentPage.schema.properties.medicalTreatmentRecords.items.properties
          .treatmentDates;
      expect(treatmentSchema.maxItems).to.equal(2);
      expect(treatmentSchema.items.required).to.deep.equal(['startDate']);
    });

    it('uses the DateRangeView helper and custom add button text', () => {
      const treatmentUi =
        treatmentPage.uiSchema.medicalTreatmentRecords.items.treatmentDates;
      expect(treatmentUi['ui:options'].viewField).to.equal(DateRangeView);
      expect(treatmentUi['ui:options'].addAnotherText).to.equal(
        'Add another treatment date',
      );
    });
  });

  describe('hospitalization dates item page', () => {
    const hospitalizationPage =
      pages.medicalTreatmentRecordsHospitalizationDatesPage;

    it('limits hospitalization ranges to two entries as well', () => {
      const hospitalizationSchema =
        hospitalizationPage.schema.properties.medicalTreatmentRecords.items
          .properties.hospitalizationDates;
      expect(hospitalizationSchema.maxItems).to.equal(2);
      expect(hospitalizationSchema.items.required).to.deep.equal(['startDate']);
    });
  });
});

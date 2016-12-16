import { expect } from 'chai';
import Estimator from '../../../src/js/gi/utils/Estimator.jsx';

describe('Estimator unit tests', () =>{

  describe('Minnesota Power Company', () => {
    const school = {};
    school.bah = '1476';
    school.country = 'USA';
    school.institution_type = {name: 'ojt'};

    context('default dropdown selections', () => {

      const estimator = new Estimator();
      estimator.setMilitaryStatus = 'veteran';
      estimator.setSpouseActiveDuty = 'no';
      estimator.setGiBillChap = '33';
      estimator.setNumberOfDepend = '0';
      estimator.setPost911Elig = 'no';
      estimator.setCumulativeService = '1.0';
      estimator.setEnlistmentService = '3';
      estimator.setConsecutiveService = '0.8';
      estimator.setOnline = 'no';
      estimator.setInstitutionType = school.institution_type.name;
      estimator.setCountry = school.country;
      estimator.setBah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql(null);
        expect(estimator.results.tuition.value).to.eql('N/A');
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(1476);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql('per year');
        expect(estimator.results.books.value).to.eql(1000);
      });

    });

  });

  describe('Northland College', () => {
    const school = {};
    school.bah = '1098';
    school.country = 'USA';
    school.institution_type = {name: 'private'};

    context('default dropdown selections', () => {

      const estimator = new Estimator();
      estimator.setMilitaryStatus = 'veteran';
      estimator.setSpouseActiveDuty = 'no';
      estimator.setGiBillChap = '33';
      estimator.setNumberOfDepend = '0';
      estimator.setPost911Elig = 'no';
      estimator.setCumulativeService = '1.0';
      estimator.setEnlistmentService = '3';
      estimator.setConsecutiveService = '0.8';
      estimator.setOnline = 'no';
      estimator.setInstitutionType = school.institution_type.name;
      estimator.setCountry = school.country;
      estimator.setBah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql('per year');
        expect(estimator.results.tuition.value).to.eql(21970);
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(1098);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql('per year');
        expect(estimator.results.books.value).to.eql(1000);
      });

    });

  });

  describe('Stanford University', () => {
    const school = {};
    school.bah = '3600';
    school.country = 'USA';
    school.institution_type = {name: 'private'};

    context('default dropdown selections', () => {

      const estimator = new Estimator();
      estimator.setMilitaryStatus = 'veteran';
      estimator.setSpouseActiveDuty = 'no';
      estimator.setGiBillChap = '33';
      estimator.setNumberOfDepend = '0';
      estimator.setPost911Elig = 'no';
      estimator.setCumulativeService = '1.0';
      estimator.setEnlistmentService = '3';
      estimator.setConsecutiveService = '0.8';
      estimator.setOnline = 'no';
      estimator.setInstitutionType = school.institution_type.name;
      estimator.setCountry = school.country;
      estimator.setBah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql('per year');
        expect(estimator.results.tuition.value).to.eql(21970);
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(3600);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql('per year');
        expect(estimator.results.books.value).to.eql(1000);
      });

    });

    context('vr&e plus post-911 eligible', () => {

      const estimator = new Estimator();
      estimator.setMilitaryStatus = 'veteran';
      estimator.setSpouseActiveDuty = 'no';
      estimator.setGiBillChap = '31';
      estimator.setNumberOfDepend = '0';
      estimator.setPost911Elig = 'yes';
      estimator.setCumulativeService = '1.0';
      estimator.setEnlistmentService = '3';
      estimator.setConsecutiveService = '0.8';
      estimator.setOnline = 'no';
      estimator.setInstitutionType = school.institution_type.name;
      estimator.setCountry = school.country;
      estimator.setBah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql(null);
        expect(estimator.results.tuition.value).to.eql('Full Cost of Attendance');
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(3600);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql(null);
        expect(estimator.results.books.value).to.eql('Full Cost of Books & Supplies');
      });

    });

    context('vr&e plus post-911 eligible, all online classes', () => {

      const estimator = new Estimator();
      estimator.setMilitaryStatus = 'veteran';
      estimator.setSpouseActiveDuty = 'no';
      estimator.setGiBillChap = '31';
      estimator.setNumberOfDepend = '0';
      estimator.setPost911Elig = 'yes';
      estimator.setCumulativeService = '1.0';
      estimator.setEnlistmentService = '3';
      estimator.setConsecutiveService = '0.8';
      estimator.setOnline = 'yes';
      estimator.setInstitutionType = school.institution_type.name;
      estimator.setCountry = school.country;
      estimator.setBah = school.bah;

      it('should return the correct tuition estimate', () => {
        estimator.renderTuitionFees();
        expect(estimator.results.tuition.qualifier).to.eql(null);
        expect(estimator.results.tuition.value).to.eql('Full Cost of Attendance');
      });

      it('should return the correct housing estimate', () => {
        estimator.renderHousingAllowance();
        expect(estimator.results.housing.qualifier).to.eql('per month');
        expect(estimator.results.housing.value).to.eql(806);
      });

      it('should return the correct books estimate', () => {
        estimator.renderBookStipend();
        expect(estimator.results.books.qualifier).to.eql(null);
        expect(estimator.results.books.value).to.eql('Full Cost of Books & Supplies');
      });

    });


  });

});

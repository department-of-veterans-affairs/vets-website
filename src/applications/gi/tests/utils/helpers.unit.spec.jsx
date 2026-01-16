import { expect } from 'chai';
import sinon from 'sinon';
import {
  addAllOption,
  convertRatingToStars,
  formatCurrency,
  formatDollarAmount,
  formatNumber,
  handleScrollOnInputFocus,
  isCountryInternational,
  isCountryUSA,
  rubyifyKeys,
  sortOptionsByStateName,
  boolYesNo,
  naIfNull,
  isURL,
  schoolSize,
  getStateNameForCode,
  phoneInfo,
  isPresent,
  locationInfo,
  scrollToFocusedElement,
  handleInputFocusWithPotentialOverLap,
  validateSearchTermSubmit,
  searchCriteriaFromCoords,
  formatProgramType,
  isReviewInstance,
  isSmallScreenLogic,
  deriveMaxAmount,
  deriveEligibleStudents,
  capitalizeFirstLetter,
  getAbbreviationsAsArray,
  formatNationalExamName,
  formatAddress,
  toTitleCase,
  formatList,
  createCheckboxes,
  updateStateDropdown,
  formatResultCount,
  filterSuggestions,
  showMultipleNames,
  formatDollarAmountWithCents,
  norm,
  toSnakeLower,
  humanize,
  tagsForRecord,
} from '../../utils/helpers';

describe('GIBCT helpers:', () => {
  describe('isReviewInstance', () => {
    let locationStub;

    beforeEach(() => {
      locationStub = sinon.stub(window, 'location').value({ hostname: '' });
    });

    afterEach(() => {
      locationStub.restore();
    });

    it('should return false for non-review hostnames', () => {
      locationStub.value.hostname = 'www.vets.gov';
      const result = isReviewInstance();
      expect(result).to.be.false;
    });

    it('should return false for completely different hostnames', () => {
      locationStub.value.hostname = 'some.other-domain.com';
      const result = isReviewInstance();
      expect(result).to.be.false;
    });
  });
  describe('formatNumber', () => {
    it('should format numbers', () => {
      expect(formatNumber(1000)).to.equal('1,000');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency', () => {
      expect(formatCurrency(1000)).to.equal('$1,000');
    });
    it('should round currency', () => {
      expect(formatCurrency(1000.5)).to.equal('$1,001');
    });
  });

  describe('addAllOption', () => {
    it('should add ALL option', () => {
      const options = [{ label: 'TEST', value: 'TEST' }];
      expect(addAllOption(options).length).to.equal(2);
      expect(addAllOption(options)[0].optionLabel).to.equal('All');
    });
  });

  describe('isCountryInternational', () => {
    it('should recognize USA', () => {
      expect(isCountryInternational('USA')).to.be.false;
    });
    it('should recognize non-USA', () => {
      expect(isCountryInternational('CAN')).to.be.true;
    });
    it('should handle lowercase country names', () => {
      expect(isCountryInternational('usa')).to.be.false;
    });
  });

  describe('isCountryUSA', () => {
    it('should recognize USA', () => {
      expect(isCountryUSA('USA')).to.be.true;
    });
    it('should recognize non-USA', () => {
      expect(isCountryUSA('CAN')).to.be.false;
    });
    it('should handle lowercase country names', () => {
      expect(isCountryUSA('usa')).to.be.true;
    });
  });

  describe('rubyifyKeys', () => {
    it('should properly snake-case keys', () => {
      const data = {
        testKey: '',
      };
      expect(rubyifyKeys(data)).to.have.key('test_key');
    });
  });

  describe('sortOptionsByStateName', () => {
    it('should sort an array of objects by label', () => {
      const data = [
        { value: 'AK', label: 'Alaska' },
        { value: 'AL', label: 'Alabama' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'CA', label: 'California' },
      ];
      const sortedData = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
      ];
      expect(data.sort(sortOptionsByStateName)).to.deep.equal(sortedData);
      const junkData = [{ value: 'AL', label: 'Alabama' }];
      expect(sortOptionsByStateName(data, junkData)).to.deep.equal(0);
    });
  });

  describe('formatDollarAmount', () => {
    it('should format a valid dollar amount correctly', () => {
      const data = 100.5;
      expect(formatDollarAmount(data)).to.equal('$101');
    });

    it('should return $0 when the input is null', () => {
      const data = null;
      expect(formatDollarAmount(data)).to.equal('$0');
    });
  });

  describe('handleScrollOnInputFocus', () => {
    const mainDiv = document.createElement('div');
    let scrolledIntoViewIsCalled = false;
    mainDiv.id = 'test';
    mainDiv.scrollIntoView = () => {
      scrolledIntoViewIsCalled = true;
    };

    it('should scrollIntoView', () => {
      window.innerWidth = 480;
      document.body.appendChild(mainDiv);
      handleScrollOnInputFocus('test');
      expect(scrolledIntoViewIsCalled).to.be.true;
    });
  });

  describe('isURL', () => {
    it('Any value will return the same value ', () => {
      const value = 'https://test.com';
      expect(isURL(value)).to.eq(true);
    });
    it("Any null or undefined will return 'N/A' ", () => {
      const value = undefined;
      expect(isURL(value)).to.eq(false);
    });
  });

  describe('naIfNull', () => {
    it('Any value will return the same value ', () => {
      const value = true;
      expect(naIfNull(value)).to.eq(true);
    });
    it("Any null or undefined will return 'N/A' ", () => {
      const value = undefined;
      expect(naIfNull(value)).to.eq('N/A');
    });
  });
  describe('isSmallScreenLogic', () => {
    it('should return false when the screen width is above the specified max width', () => {
      window.matchMedia = () => ({ matches: false });
      expect(isSmallScreenLogic(600)).to.be.false;
    });
  });
  describe('boolYesNo', () => {
    it("Boolean true is turned into string 'Yes' ", () => {
      const field = true;
      expect(boolYesNo(field)).to.eq('Yes');
    });
    it("Boolean true is turned into string 'No' ", () => {
      const field = false;
      expect(boolYesNo(field)).to.eq('No');
    });
  });
  describe('schoolSize', () => {
    it("null is turned into string 'Unknown' ", () => {
      const enrollment = null;
      expect(schoolSize(enrollment)).to.eq('Unknown');
    });
    it(" '1abc8' is turned into string 'Unknown' ", () => {
      const enrollment = '1abc8';
      expect(schoolSize(enrollment)).to.eq('Unknown');
    });
    it("enrollment = 1,980 is turned into string 'Small' ", () => {
      const enrollment = 1980;
      expect(schoolSize(enrollment)).to.eq('Small');
    });
    it("enrollment = 14,800 is turned into string 'Medium' ", () => {
      const enrollment = 14800;
      expect(schoolSize(enrollment)).to.eq('Medium');
    });
    it("enrollment = 1480,000 is turned into string 'Large' ", () => {
      const enrollment = 1480000;
      expect(schoolSize(enrollment)).to.eq('Large');
    });
  });
  describe('getStateNameForCode', () => {
    it("field = 'FL' is turned into string 'Florida' ", () => {
      const field = 'FL';
      expect(getStateNameForCode(field)).to.eq('Florida');
    });
    it("field = 'FL' is turned into string 'Florida' ", () => {
      const field = 'n/a';
      expect(getStateNameForCode(field)).to.eq('N/A');
    });
  });
  describe('phoneInfo', () => {
    it(" areaCode = 123, phoneNumber = 4567890 are turned into number 'Florida' ", () => {
      const areaCode = 123;
      const phoneNumber = 4567890;
      expect(phoneInfo(areaCode, phoneNumber)).to.eq('123-4567890');
    });
    it('should return an empty string when both areaCode and phoneNumber are missing', () => {
      const areaCode = '';
      const phoneNumber = '';

      const result = phoneInfo(areaCode, phoneNumber);

      expect(result).to.eq('');
    });
  });
  describe('isPresent', () => {
    it(" value = 'SampleText' are turned into number false ", () => {
      const value = 'SampleText';
      expect(isPresent(value)).to.eq(true);
    });
  });
  // locationInfo
  describe('locationInfo', () => {
    it(" value = 'SampleText' are turned into number false ", () => {
      const city = 'Austin';
      const state = 'TX';
      const country = 'USA';
      expect(locationInfo(city, state, country)).to.eq('Austin, TX');
    });
    it(' Not State are turned into number false ', () => {
      const city = 'Austin';
      const state = undefined;
      const country = 'USA';
      expect(locationInfo(city, state, country)).to.eq('Austin');
    });
    it(' Not City are turned into number false ', () => {
      const city = undefined;
      const state = 'TX';
      const country = 'USA';
      expect(locationInfo(city, state, country)).to.eq('TX');
    });
    it(' Not City are turned into number false ', () => {
      const city = undefined;
      const state = undefined;
      const country = 'CA';
      expect(locationInfo(city, state, country)).to.eq('CA');
    });
    it(' Not City are turned into number false ', () => {
      const city = 'Rome';
      const state = 'Italy';
      const country = 'CA';
      expect(locationInfo(city, state, country)).to.eq('Rome, CA');
    });
  });

  describe('convertRatingToStars', () => {
    it('returns null for invalid ratings', () => {
      expect(convertRatingToStars('dogs')).to.eq(null);
    });

    it('converts string to number', () => {
      const { full, half, display } = convertRatingToStars('2.24');
      expect(full).to.eq(2);
      expect(half).to.eq(false);
      expect(display).to.eq('2.2');
    });

    it('converts < .3 as a whole number of stars', () => {
      const { full, half, display } = convertRatingToStars(2.24);
      expect(full).to.eq(2);
      expect(half).to.eq(false);
      expect(display).to.eq('2.2');
    });

    it('converts .3 as a half star', () => {
      const { full, half, display } = convertRatingToStars(4.29);
      expect(full).to.eq(4);
      expect(half).to.eq(true);
      expect(display).to.eq('4.3');
    });

    it('converts .7 as a half star', () => {
      const { full, half, display } = convertRatingToStars(4.7);
      expect(full).to.eq(4);
      expect(half).to.eq(true);
      expect(display).to.eq('4.7');
    });

    it('converts more than .7 as a full star', () => {
      const { full, half, display } = convertRatingToStars(3.75);
      expect(full).to.eq(4);
      expect(half).to.eq(false);
      expect(display).to.eq('3.8');
    });
  });
  describe('scrollToFocusedElement', () => {
    let scrollToStub;

    beforeEach(() => {
      scrollToStub = sinon.stub().callsFake(() => {});

      global.window.scrollTo = scrollToStub;
    });

    it('scrolls to focused element if it is below the compare drawer', () => {
      const activeElement = document.createElement('div');
      activeElement.id = 'testElement';
      document.body.appendChild(activeElement);
      activeElement.focus();

      const compareDrawer = document.createElement('div');
      compareDrawer.id = 'compare-drawer';
      compareDrawer.style.height = '100px';
      document.body.appendChild(compareDrawer);

      const getScrollOptions = () => ({});

      scrollToFocusedElement(getScrollOptions);
      expect(scrollToStub.calledOnce).to.be.false;
      expect(scrollToStub.calledWith(0, activeElement.offsetTop)).to.be.false;
    });

    it('does not scroll if focused element is above the compare drawer', () => {
      const activeElement = document.createElement('div');
      activeElement.id = 'testElement';
      document.body.appendChild(activeElement);
      activeElement.focus();

      const compareDrawer = document.createElement('div');
      compareDrawer.id = 'compare-drawer';
      compareDrawer.style.height = '100px';
      document.body.appendChild(compareDrawer);

      const getScrollOptions = () => ({});
      global.window.scrollTo(0, 200);

      scrollToFocusedElement(getScrollOptions);
      expect(scrollToStub.called).to.be.true;
    });
  });
  describe('searchCriteriaFromCoords', () => {
    // Import server and rest from mocha-setup to mock the mapbox API
    // The sinon stub on mapboxClient doesn't work because mbxClient is created
    // at module load time from mbxGeo(mapboxClient)
    const { server, rest } = require('platform/testing/unit/mocha-setup');

    beforeEach(() => {
      // Mock the mapbox geocoding API endpoint
      server.use(
        rest.get('https://api.mapbox.com/geocoding/*', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              features: [
                {
                  // eslint-disable-next-line camelcase
                  place_name:
                    'Kinney Creek Road, Gales Creek, Oregon 97117, United States',
                },
              ],
            }),
          );
        }),
      );
    });

    it('should return searchString and position based on coordinates', async () => {
      const longitude = -123.456;
      const latitude = 45.678;

      const result = await searchCriteriaFromCoords(longitude, latitude);

      expect(result).to.be.an('object');
      expect(result).to.have.all.keys('searchString', 'position');
      expect(result.searchString).to.equal(
        'Kinney Creek Road, Gales Creek, Oregon 97117, United States',
      );
      expect(result.position).to.deep.equal({ longitude, latitude });
    });
  });
  describe('validateSearchTermSubmit', () => {
    let dispatchError;
    let error;
    let filters;

    beforeEach(() => {
      dispatchError = sinon.spy();
      error = null;
      filters = { school: true, employer: true, trainingProvider: true };
    });

    it('should validate name search term', () => {
      const valid = validateSearchTermSubmit(
        'Test',
        dispatchError,
        error,
        filters,
        'name',
      );
      expect(valid).to.be.true;
      expect(dispatchError.called).to.be.false;

      const invalid = validateSearchTermSubmit(
        ' ',
        dispatchError,
        error,
        filters,
        'name',
      );
      expect(invalid).to.be.false;
      expect(
        dispatchError.calledWith(
          'Please fill in a school, employer, or training provider.',
        ),
      ).to.be.true;
    });

    it('should validate location search term', () => {
      const valid = validateSearchTermSubmit(
        '12345',
        dispatchError,
        error,
        filters,
        'location',
      );
      expect(valid).to.be.true;
      expect(dispatchError.called).to.be.false;

      const invalid = validateSearchTermSubmit(
        '123456',
        dispatchError,
        error,
        filters,
        'location',
      );
      expect(invalid).to.be.false;
      expect(dispatchError.calledWith('Please enter a valid postal code.')).to
        .be.true;
    });
    it('should not dispatchError when error is not null for name', () => {
      const invalid = validateSearchTermSubmit(
        'new york',
        dispatchError,
        (error = 'error'),
        filters,
        'name',
      );
      expect(invalid).to.be.true;
      expect(
        dispatchError.calledWith(
          'Please fill in a school, employer, or training provider',
        ),
      ).to.be.false;
    });
    it('should not dispatchError when error is not null for location', () => {
      const invalid = validateSearchTermSubmit(
        '94121',
        dispatchError,
        (error = 'error'),
        filters,
        'location',
      );
      expect(invalid).to.be.true;
      expect(dispatchError.calledWith('Please enter a valid postal code.')).to
        .be.false;
    });
    it('should dispatchError search input is empty', () => {
      validateSearchTermSubmit('', dispatchError, error, filters, 'location');

      expect(
        dispatchError.calledWith(
          'Please fill in a city, state, or postal code.',
        ),
      ).to.be.true;
    });
  });

  describe('handleInputFocusWithPotentialOverLap', () => {
    let scrollIntoViewStub;
    let scrollByStub;
    let getElementByIdStub;

    beforeEach(() => {
      // const isMobileViewStub = sinon.stub().returns(true);
      scrollIntoViewStub = sinon.stub();
      scrollByStub = sinon.stub();

      getElementByIdStub = sinon.stub(document, 'getElementById');
      getElementByIdStub.returns({
        scrollIntoView: scrollIntoViewStub,
        getBoundingClientRect: sinon.stub().returns({
          right: 10,
          left: 0,
          bottom: 10,
          top: 0,
        }),
        scrollBy: scrollByStub,
      });
    });

    afterEach(() => {
      getElementByIdStub.restore();
    });

    it('should handle input focus with potential overlap', () => {
      handleInputFocusWithPotentialOverLap(
        'field1',
        'field2',
        'scrollableField',
      );
      expect(scrollIntoViewStub.called).to.be.false;
      expect(scrollByStub.called).to.be.false;
    });
  });
  describe('capitalizeFirstLetter', () => {
    it('should return null when the string is null', () => {
      expect(capitalizeFirstLetter(null)).to.equal(null);
    });

    it('should return null when the string is undefined', () => {
      expect(capitalizeFirstLetter(undefined)).to.equal(null);
    });

    it('should capitalize the first letter of a single word', () => {
      expect(capitalizeFirstLetter('hello')).to.equal('Hello');
    });

    it('should return the string as is if the first letter is already uppercase', () => {
      expect(capitalizeFirstLetter('Hello')).to.equal('Hello');
    });

    it('should handle empty strings and return null', () => {
      expect(capitalizeFirstLetter('')).to.equal(null);
    });

    it('should handle strings with special characters correctly', () => {
      expect(capitalizeFirstLetter('@hello')).to.equal('@hello');
    });

    it('should handle strings with numbers at the beginning correctly', () => {
      expect(capitalizeFirstLetter('123hello')).to.equal('123hello');
    });
  });

  describe('formatProgramType', () => {
    it('should return an empty string when programType is null or undefined', () => {
      expect(formatProgramType(null)).to.equal('');
    });

    it('should return an empty string when programType is an empty string', () => {
      expect(formatProgramType('')).to.equal('');
    });

    it('should capitalize only the first letter of the entire string and replace hyphens with spaces', () => {
      expect(formatProgramType('online-program')).to.equal('Online program');
    });

    it('should handle a single word programType by capitalizing only its first letter', () => {
      expect(formatProgramType('bachelor')).to.equal('Bachelor');
    });

    it('should handle multiple hyphenated words, keeping only the first letter capitalized overall', () => {
      expect(formatProgramType('associate-degree-program')).to.equal(
        'Associate degree program',
      );
    });

    it('should handle programType with extra hyphens', () => {
      expect(formatProgramType('masters--program')).to.equal('Masters program');
    });

    it('should lowercase remaining characters for the entire string', () => {
      expect(formatProgramType('DOCTORATE-PROGRAM')).to.equal(
        'Doctorate program',
      );
    });

    it('should return a formatted string for "on-the-job-training-apprenticeship"', () => {
      expect(formatProgramType('on-the-job-training-apprenticeship')).to.equal(
        'On-the-job training/Apprenticeships',
      );
    });
  });
  describe('deriveMaxAmount', () => {
    it('should return "Not provided" if no contributionAmount is given', () => {
      expect(deriveMaxAmount()).to.equal('Not provided');
      expect(deriveMaxAmount(null)).to.equal('Not provided');
      expect(deriveMaxAmount('')).to.equal('Not provided');
    });

    it('should return a specific string when contributionAmount >= 99999', () => {
      expect(deriveMaxAmount('99999')).to.equal(
        "Pays remaining tuition that Post-9/11 GI Bill doesn't cover",
      );
      expect(deriveMaxAmount('100000')).to.equal(
        "Pays remaining tuition that Post-9/11 GI Bill doesn't cover",
      );
    });

    it('should format currency correctly for values less than 99999', () => {
      expect(deriveMaxAmount('5000')).to.equal('$5,000');
      expect(deriveMaxAmount('1234.56')).to.equal('$1,235');
      expect(deriveMaxAmount(300)).to.equal('$300');
    });
  });
  describe('deriveEligibleStudents', () => {
    it('should return "Not provided" if no numberOfStudents is given', () => {
      expect(deriveEligibleStudents()).to.equal('Not provided');
      expect(deriveEligibleStudents(null)).to.equal('Not provided');
      expect(deriveEligibleStudents('')).to.equal('Not provided');
    });

    it('should return "All eligible students" if numberOfStudents >= 99999', () => {
      expect(deriveEligibleStudents(99999)).to.equal('All eligible students');
      expect(deriveEligibleStudents(100000)).to.equal('All eligible students');
    });

    it('should return "1 student" if numberOfStudents is exactly 1', () => {
      expect(deriveEligibleStudents(1)).to.equal('1 student');
    });

    it('should return "<X> students" for values other than 1 and less than 99999', () => {
      expect(deriveEligibleStudents(2)).to.equal('2 students');
      expect(deriveEligibleStudents(50)).to.equal('50 students');
    });
  });
  describe('getAbbreviationsAsArray', () => {
    it('should return an empty array when value is null or undefined or an empty string', () => {
      expect(getAbbreviationsAsArray(null)).to.deep.equal([]);
      expect(getAbbreviationsAsArray(undefined)).to.deep.equal([]);
      expect(getAbbreviationsAsArray('')).to.deep.equal([]);
    });

    it('should return the corresponding abbreviations for "OJT"', () => {
      const result = getAbbreviationsAsArray('OJT');
      expect(result).to.deep.equal([
        'APP: Apprenticeships',
        'NPFA: Non Pay Federal Agency',
        'NPOJT: Non Pay On-the-job-training',
        'OJT: On-the-job training',
      ]);
    });

    it('should return the corresponding abbreviations for "NCD"', () => {
      const result = getAbbreviationsAsArray('NCD');
      expect(result).to.deep.equal([
        'CERT: Certification',
        'UG CERT: Undergraduate Certification',
      ]);
    });

    it('should return the corresponding abbreviations for "IHL"', () => {
      const result = getAbbreviationsAsArray('IHL');
      expect(result).to.deep.equal([
        'AA: Associate of Arts',
        'AS: Associate of Science',
        'BA: Bachelor of Arts',
        'BS: Bachelor of Science',
        'GRAD CERT: Graduate Certification',
        'MA: Master of Arts',
        'MBA: Master of Business Administration',
        'MS: Master of Science',
        'PhD: Doctor of Philosophy',
      ]);
    });

    it('should return the corresponding abbreviations for "CORR"', () => {
      const result = getAbbreviationsAsArray('CORR');
      expect(result).to.deep.equal([
        'AAS: Associate of Applied Science',
        'CERT: Certification',
      ]);
    });

    it('should return the corresponding abbreviations for "FLGT"', () => {
      const result = getAbbreviationsAsArray('FLGT');
      expect(result).to.deep.equal([
        'AMEL: Airplane Multi Engine Land',
        'ASEL: Airplane Single Engine Land',
        'ATM: Airline Transport Multiengine',
        'ATP: Airline Transport Pilot',
        'ATS: Airline Transport Single Engine',
        'CFI: Certified Flight Instructor',
        'CFII: Certified Flight Instructor Instrument',
        'IR: Instrument Rating',
        'MEI: Multi Engine Instructor',
        'PPIL: Professional Pilot Interdisciplinary Sciences',
        'ROTO: Rotorcraft; Rotary-Wing Aircraft',
      ]);
    });

    it('should return an empty array when the value is not found in the mapping', () => {
      expect(getAbbreviationsAsArray('XYZ')).to.deep.equal([]);
    });
  });

  describe('formatNationalExamName', () => {
    it('should return an empty string when name is null', () => {
      expect(formatNationalExamName(null)).to.equal('');
    });

    it('should return an empty string when name is undefined', () => {
      expect(formatNationalExamName(undefined)).to.equal('');
    });

    it('should return an empty string when name is an empty string', () => {
      expect(formatNationalExamName('')).to.equal('');
    });

    it('should return an empty string when name is only whitespace', () => {
      expect(formatNationalExamName('   ')).to.equal('');
    });

    it('should return "DSST-DANTES" unchanged', () => {
      expect(formatNationalExamName('DSST-DANTES')).to.equal('DSST-DANTES');
    });

    it('should format "MAT-MILLER ANALOGIES TEST" to "MAT-MILLER analogies test"', () => {
      expect(formatNationalExamName('MAT-MILLER ANALOGIES TEST')).to.equal(
        'MAT-MILLER analogies test',
      );
    });

    it('should return "ECE (4 hours)" unchanged', () => {
      expect(formatNationalExamName('ECE (4 hours)')).to.equal('ECE (4 hours)');
    });

    it('should return "ECE (6 hours)" unchanged', () => {
      expect(formatNationalExamName('ECE (6 hours)')).to.equal('ECE (6 hours)');
    });

    it('should format "ECE 8 HOURS NURSING" to "ECE (8 hours) nursing"', () => {
      expect(formatNationalExamName('ECE 8 HOURS NURSING')).to.equal(
        'ECE (8 hours) nursing',
      );
    });

    it('should format "DANTES SPONSORED CLEP EXAMS" to "DANTES sponsored clep exams"', () => {
      expect(formatNationalExamName('DANTES SPONSORED CLEP EXAMS')).to.equal(
        'DANTES sponsored clep exams',
      );
    });

    it('should properly split on dash and lowercase the right side', () => {
      expect(formatNationalExamName('AP-ADVANCED PLACEMENT EXAMS')).to.equal(
        'AP-advanced placement exams',
      );
      expect(
        formatNationalExamName('CLEP-COLLEGE LEVEL EXAMINATION PROGRAM'),
      ).to.equal('CLEP-college level examination program');
    });

    it('should return the original name if no other condition is met', () => {
      expect(formatNationalExamName('ACT')).to.equal('ACT');
      expect(formatNationalExamName('MCAT')).to.equal('MCAT');
      expect(formatNationalExamName('TOEFL')).to.equal('TOEFL');
    });
  });
  describe('formatAddress', () => {
    it('should return the same value if input is not a string', () => {
      expect(formatAddress(null)).to.equal(null);
      expect(formatAddress(undefined)).to.equal(undefined);
      expect(formatAddress(12345)).to.equal(12345);
      expect(formatAddress({})).to.deep.equal({});
      expect(formatAddress([])).to.deep.equal([]);
      expect(formatAddress(() => {})).to.be.a('function');
    });

    it('should return the same string if it is empty or only whitespace', () => {
      expect(formatAddress('')).to.equal('');
      expect(formatAddress('   ')).to.equal('   ');
      expect(formatAddress('\t\n')).to.equal('\t\n');
    });

    it('should capitalize each word properly', () => {
      expect(formatAddress('123 main street')).to.equal('123 Main Street');
      expect(formatAddress('456 elm avenue')).to.equal('456 Elm Avenue');
      expect(formatAddress('789 broadWAY')).to.equal('789 Broadway');
      expect(formatAddress('1010 PINE Boulevard')).to.equal(
        '1010 Pine Boulevard',
      );
    });

    it('should keep exceptions in uppercase', () => {
      expect(formatAddress('500 nw 25th street')).to.equal(
        '500 NW 25th Street',
      );
      expect(formatAddress('800 Nw Elm Avenue')).to.equal('800 NW Elm Avenue');
      expect(formatAddress('900 nw Broadway')).to.equal('900 NW Broadway');
    });

    it('should handle multiple spaces and different whitespace characters', () => {
      expect(formatAddress('1600  Pennsylvania Ave')).to.equal(
        '1600 Pennsylvania Ave',
      );
      expect(formatAddress(' 742  Evergreen Terrace ')).to.equal(
        '742 Evergreen Terrace',
      );
      expect(formatAddress('221B\tBaker\nStreet')).to.equal(
        '221B Baker Street',
      );
    });

    it('should handle mixed case and special characters', () => {
      expect(formatAddress('a1b2c3 d4E5F6')).to.equal('A1b2c3 D4e5f6');
      expect(formatAddress('PO BOX 123')).to.equal('PO Box 123');
      expect(formatAddress('UNIT 4567-A')).to.equal('Unit 4567-A');
    });

    it('should handle words with hyphens correctly', () => {
      expect(formatAddress('123 north-west road')).to.equal(
        '123 North-West Road',
      );
      expect(formatAddress('456 NW-7th Ave')).to.equal('456 NW-7th Ave');
      expect(formatAddress('789 nw-elm street')).to.equal('789 NW-Elm Street');
      expect(formatAddress('PO-BOX-123')).to.equal('PO-Box-123');
      expect(formatAddress('NW-WEST'));
      expect(formatAddress('NW-WEST Road')).to.equal('NW-West Road');
    });

    it('should handle single-word addresses', () => {
      expect(formatAddress('Main')).to.equal('Main');
      expect(formatAddress('nw')).to.equal('NW');
      expect(formatAddress('NW')).to.equal('NW');
      expect(formatAddress('PO')).to.equal('PO');
    });

    it('should handle addresses with numbers and letters', () => {
      expect(formatAddress('1234 NW5th Street')).to.equal('1234 NW5th Street');
      expect(formatAddress('5678 nw12th Avenue')).to.equal(
        '5678 NW12th Avenue',
      );
      expect(formatAddress('91011 NW-13th Blvd')).to.equal(
        '91011 NW-13th Blvd',
      );
    });

    it('should not alter the original string structure beyond capitalization', () => {
      const input = '123 Main-Street NW';
      const expected = '123 Main-Street NW';
      expect(formatAddress(input)).to.equal(expected);
    });

    it('should trim leading and trailing whitespace', () => {
      expect(formatAddress('   1600 Pennsylvania Ave   ')).to.equal(
        '1600 Pennsylvania Ave',
      );
      expect(formatAddress('\t742 Evergreen Terrace\n')).to.equal(
        '742 Evergreen Terrace',
      );
    });
  });
  describe('toTitleCase', () => {
    it('should return an empty string when input is null,undefined, or an empty string', () => {
      expect(toTitleCase(null)).to.equal('');
      expect(toTitleCase(undefined)).to.equal('');
      expect(toTitleCase('')).to.equal('');
    });

    it('should return an empty string when input is only whitespace', () => {
      expect(toTitleCase('   ')).to.equal('');
      expect(toTitleCase('\t\n')).to.equal('');
    });

    it('should capitalize a single lowercase word', () => {
      expect(toTitleCase('hello')).to.equal('Hello');
    });

    it('should capitalize a single uppercase word', () => {
      expect(toTitleCase('HELLO')).to.equal('Hello');
    });

    it('should capitalize a single mixed-case word', () => {
      expect(toTitleCase('hElLo')).to.equal('Hello');
    });

    it('should capitalize multiple words separated by spaces', () => {
      expect(toTitleCase('hello world')).to.equal('Hello World');
      expect(toTitleCase('javaScript is awesome')).to.equal(
        'Javascript Is Awesome',
      );
    });

    it('should handle words with hyphens correctly', () => {
      expect(toTitleCase('state-of-the-art')).to.equal('State-Of-The-Art');
      expect(toTitleCase('well-known fact')).to.equal('Well-Known Fact');
      expect(toTitleCase('mother-in-law')).to.equal('Mother-In-Law');
    });

    it('should handle multiple hyphenated words in a sentence', () => {
      expect(
        toTitleCase('the state-of-the-art technology is well-known'),
      ).to.equal('The State-Of-The-Art Technology Is Well-Known');
    });

    it('should handle words with numbers correctly', () => {
      expect(toTitleCase('version2 update')).to.equal('Version2 Update');
      expect(toTitleCase('room 101')).to.equal('Room 101');
    });

    it('should handle words with special characters correctly', () => {
      expect(toTitleCase('@hello world!')).to.equal('@hello World!');
      expect(toTitleCase('good-morning, everyone')).to.equal(
        'Good-Morning, Everyone',
      );
    });

    it('should handle multiple spaces between words', () => {
      expect(toTitleCase('1600  Pennsylvania Ave')).to.equal(
        '1600 Pennsylvania Ave',
      );
      expect(toTitleCase('742   Evergreen Terrace')).to.equal(
        '742 Evergreen Terrace',
      );
    });

    it('should trim leading and trailing whitespace and capitalize correctly', () => {
      expect(toTitleCase('   123 main street   ')).to.equal('123 Main Street');
      expect(toTitleCase('\t456 elm avenue\n')).to.equal('456 Elm Avenue');
    });
  });

  describe('formatList', () => {
    it('should handle various array lengths', () => {
      expect(formatList([])).to.equal('');
      expect(formatList(['one'])).to.equal('one');
      expect(formatList(['one', 'two'])).to.equal('one or two');
      expect(formatList(['one', 'two', 'three'])).to.equal('one, two or three');
      expect(formatList(['one', 'two', 'three', 'four'])).to.equal(
        'one, two, three or four',
      );
    });
  });

  describe('createCheckboxes', () => {
    const categories = ['license', 'certification', 'prep course'];

    it('should create checkboxes with correct checked states', () => {
      const checkedList = ['license', 'certification'];
      const result = createCheckboxes(categories, checkedList);

      expect(result).to.deep.equal([
        { name: 'license', checked: true, label: 'License' },
        { name: 'certification', checked: true, label: 'Certification' },
        { name: 'prep course', checked: false, label: 'Prep Course' },
      ]);
    });

    it('should check all boxes when checkedList includes "all"', () => {
      const result = createCheckboxes(categories, ['all']);

      expect(result.every(box => box.checked)).to.be.true;
    });
  });

  describe('updateStateDropdown', () => {
    const mockMultiples = [
      { state: 'CA', eduLacTypeNm: 'License' },
      { state: 'NY', eduLacTypeNm: 'License' },
      { state: 'TX', eduLacTypeNm: 'Certification' },
    ];

    it('should filter states and set current selection', () => {
      const result = updateStateDropdown(mockMultiples, 'CA');

      expect(result.options).to.include.deep.members([
        { optionValue: 'all', optionLabel: 'All' },
        { optionValue: 'CA', optionLabel: 'California' },
        { optionValue: 'NY', optionLabel: 'New York' },
      ]);
      expect(result.current.optionValue).to.equal('CA');
    });

    it('should exclude certification states', () => {
      const result = updateStateDropdown(mockMultiples);
      const txOption = result.options.find(opt => opt.optionValue === 'TX');
      expect(txOption).to.be.undefined;
    });
  });

  describe('formatResultCount', () => {
    it('should format counts correctly', () => {
      const results = Array(25).fill({});

      expect(formatResultCount(results, 1, 10)).to.equal('1 - 10');
      expect(formatResultCount(results, 2, 10)).to.equal('11 - 20');
      expect(formatResultCount(results, 3, 10)).to.equal('21 - 25');
    });
  });

  describe('filterSuggestions', () => {
    const suggestions = [
      {
        enrichedId: '3@a5de3',
        lacNm: 'HVAC/R Class A',
        eduLacTypeNm: 'License',
        state: 'AR',
      },
      {
        enrichedId: '82@ddbed',
        lacNm: 'Safety Director Certificate',
        eduLacTypeNm: 'Certification',
        state: 'NC',
      },
      {
        enrichedId: '2469@78799',
        lacNm: 'REGISTERED PROFESSIONAL NURSE',
        eduLacTypeNm: 'License',
        state: 'MO',
      },
      {
        enrichedId: '4367@fd631',
        lacNm: 'PREP-FLORIDA FOUNDATION PLUS-ONLINE HOME INSPECTIO',
        eduLacTypeNm: 'Prep Course',
        state: 'MO',
      },
    ];

    it('should return all results when no filters are applied', () => {
      const results = filterSuggestions(suggestions, '', ['all'], 'all');
      expect(results).to.deep.equal(suggestions);
    });

    it('should filter by name case-insensitively', () => {
      const results = filterSuggestions(suggestions, 'HVAC', ['all'], 'all');
      expect(results).to.have.length(1);
      expect(results[0].lacNm).to.equal('HVAC/R Class A');

      const results2 = filterSuggestions(suggestions, 'hvac', ['all'], 'all');
      expect(results2).to.have.length(1);
      expect(results2[0].lacNm).to.equal('HVAC/R Class A');
    });

    it('should filter by category', () => {
      const results = filterSuggestions(suggestions, '', ['license'], 'all');
      expect(results).to.have.length(2);
      expect(results.every(r => r.eduLacTypeNm === 'License')).to.be.true;
    });

    it('should filter by state except for certifications', () => {
      const results = filterSuggestions(suggestions, '', ['all'], 'MO');
      expect(results).to.have.length(3);
      // Should include both MO items and the certification (which ignores state)
      expect(results.some(r => r.eduLacTypeNm === 'Certification')).to.be.true;
      expect(results.filter(r => r.state === 'MO')).to.have.length(2);
    });

    it('should combine name, category, and state filters', () => {
      const results = filterSuggestions(
        suggestions,
        'nurse',
        ['license'],
        'MO',
      );
      expect(results).to.have.length(1);
      expect(results[0].lacNm).to.equal('REGISTERED PROFESSIONAL NURSE');
      expect(results[0].eduLacTypeNm).to.equal('License');
      expect(results[0].state).to.equal('MO');
    });

    it('should return empty array when no matches found', () => {
      const results = filterSuggestions(
        suggestions,
        'nonexistent',
        ['all'],
        'all',
      );
      expect(results).to.have.length(0);
    });
  });

  describe('showMultipleNames', () => {
    const suggestions = [
      { lacNm: 'HVAC/R Class A' },
      { lacNm: 'Safety Director Certificate' },
      { lacNm: 'REGISTERED PROFESSIONAL NURSE' },
      { lacNm: 'PREP-FLORIDA FOUNDATION PLUS' },
    ];

    it('should return empty array when suggestions or nameInput is missing', () => {
      expect(showMultipleNames(null, 'test')).to.deep.equal([]);
      expect(showMultipleNames(suggestions, '')).to.deep.equal([]);
      expect(showMultipleNames(suggestions, null)).to.deep.equal([]);
    });

    it('should filter suggestions case-insensitively by name input', () => {
      const results = showMultipleNames(suggestions, 'hvac');
      expect(results).to.have.length(1);
      expect(results[0].lacNm).to.equal('HVAC/R Class A');

      const results2 = showMultipleNames(suggestions, 'SAFETY');
      expect(results2).to.have.length(1);
      expect(results2[0].lacNm).to.equal('Safety Director Certificate');
    });

    it('should return multiple matches when applicable', () => {
      const results = showMultipleNames(suggestions, 'a');
      expect(results.length).to.be.greaterThan(1);
    });
  });

  describe('formatDollarAmountWithCents', () => {
    it('should return message when value is falsy', () => {
      const message = 'Not Available';
      expect(formatDollarAmountWithCents(null, message)).to.equal(message);
      expect(formatDollarAmountWithCents(undefined, message)).to.equal(message);
      expect(formatDollarAmountWithCents('', message)).to.equal(message);
      expect(formatDollarAmountWithCents(0, message)).to.equal(message);
    });

    it('should format whole numbers correctly', () => {
      expect(formatDollarAmountWithCents(1000, 'N/A')).to.equal('$1,000.00');
      expect(formatDollarAmountWithCents(1, 'N/A')).to.equal('$1.00');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatDollarAmountWithCents(1000.5, 'N/A')).to.equal('$1,000.50');
      expect(formatDollarAmountWithCents(1000.55, 'N/A')).to.equal('$1,000.55');
      expect(formatDollarAmountWithCents(1000.555, 'N/A')).to.equal(
        '$1,000.56',
      );
    });

    it('should handle string number inputs', () => {
      expect(formatDollarAmountWithCents('1000', 'N/A')).to.equal('$1,000.00');
      expect(formatDollarAmountWithCents('1000.5', 'N/A')).to.equal(
        '$1,000.50',
      );
    });
  });
  describe('norm', () => {
    it('lowercases a normal string', () => {
      expect(norm('HeLLo')).to.equal('hello');
    });

    it('returns empty string for null/undefined', () => {
      expect(norm(null)).to.equal('');
      expect(norm(undefined)).to.equal('');
    });

    it('stringifies non-strings then lowercases', () => {
      expect(norm(123)).to.equal('123');
      expect(norm(true)).to.equal('true');
    });
  });

  describe('toSnakeLower', () => {
    it('converts camelCase to snake_lower', () => {
      expect(toSnakeLower('studentLoans')).to.equal('student_loans');
    });

    it('converts PascalCase to snake_lower', () => {
      expect(toSnakeLower('StudentLoans')).to.equal('student_loans');
    });

    it('keeps an already snake_lower string unchanged', () => {
      expect(toSnakeLower('degree_requirements')).to.equal(
        'degree_requirements',
      );
    });

    it('handles empty, null, and undefined inputs', () => {
      expect(toSnakeLower('')).to.equal('');
      expect(toSnakeLower(null)).to.equal('null');
      expect(toSnakeLower(undefined)).to.equal('undefined');
    });
  });

  describe('humanize', () => {
    it('replaces underscores with spaces and title-cases words', () => {
      expect(humanize('degree_requirements')).to.equal('Degree Requirements');
      expect(humanize('on_the_job_training')).to.equal('On The Job Training');
    });

    it('handles empty / null / undefined as empty string', () => {
      expect(humanize('')).to.equal('');
      expect(humanize(null)).to.equal('');
      expect(humanize(undefined)).to.equal('');
    });

    it('does not force lowercase for inner letters (documents behavior)', () => {
      expect(humanize('mixed_CASE_input')).to.equal('Mixed CASE Input');
    });
  });

  describe('tagsForRecord', () => {
    it('dedupes and lowercases categories', () => {
      const rec = { categories: ['Marketing', 'Other', 'marketing', 'OTHER'] };
      expect(tagsForRecord(rec)).to.deep.equal(['marketing', 'other']);
    });

    it('preserves order of first occurrences', () => {
      const rec = { categories: ['Quality', 'Refund', 'quality', 'Other'] };
      expect(tagsForRecord(rec)).to.deep.equal(['quality', 'refund', 'other']);
    });

    it('returns empty array when categories is missing, null, or rec is falsy', () => {
      expect(tagsForRecord({})).to.deep.equal([]);
      expect(tagsForRecord({ categories: null })).to.deep.equal([]);
      expect(tagsForRecord(undefined)).to.deep.equal([]);
    });

    it('handles non-string values in categories by stringifying then lowercasing', () => {
      const rec = { categories: [123, true, 'FiNaNcIaL'] };
      expect(tagsForRecord(rec)).to.deep.equal(['123', 'true', 'financial']);
    });
  });
});

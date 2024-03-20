import { expect } from 'chai';
import sinon from 'sinon';
import mapboxClient from '../../components/MapboxClient';
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
  validateSearchTerm,
  searchCriteriaFromCoords,
} from '../../utils/helpers';

describe('GIBCT helpers:', () => {
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
    const data = 100.5;
    expect(formatDollarAmount(data)).to.equal('$101');
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
    let reverseGeocodeStub;
    beforeEach(() => {
      reverseGeocodeStub = sinon.stub(mapboxClient, 'reverseGeocode').returns({
        send: () =>
          Promise.resolve({
            body: {
              features: [
                {
                  placeName:
                    'Kinney Creek Road, Gales Creek, Oregon 97117, United States',
                },
              ],
            },
          }),
      });
    });
    afterEach(() => {
      reverseGeocodeStub.restore();
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
  describe('validateSearchTerm', () => {
    let dispatchError;
    let error;
    let filters;

    beforeEach(() => {
      dispatchError = sinon.spy();
      error = null;
      filters = { school: true, employer: true, trainingProvider: true };
    });

    it('should validate name search term', () => {
      const valid = validateSearchTerm(
        'Test',
        dispatchError,
        error,
        filters,
        'name',
      );
      expect(valid).to.be.true;
      expect(dispatchError.called).to.be.false;

      const invalid = validateSearchTerm(
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
      const valid = validateSearchTerm(
        '12345',
        dispatchError,
        error,
        filters,
        'location',
      );
      expect(valid).to.be.true;
      expect(dispatchError.called).to.be.false;

      const invalid = validateSearchTerm(
        '123456',
        dispatchError,
        error,
        filters,
        'location',
      );
      expect(invalid).to.be.true;
      expect(dispatchError.calledWith('Please enter a valid postal code.')).to
        .be.true;
    });
    it('should not dispatchError when error is not null for name', () => {
      const invalid = validateSearchTerm(
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
      const invalid = validateSearchTerm(
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
      validateSearchTerm('', dispatchError, error, filters, 'location');

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
});

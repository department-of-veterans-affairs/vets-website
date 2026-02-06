import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  formatFacilityList,
  formatFacilityUnorderedList,
} from '../../util/facilityHelpers';

describe('formatFacilityUnorderedList', () => {
  describe('formatFacilityList', () => {
    it('should return empty string for null input', () => {
      expect(formatFacilityList(null)).to.equal('');
    });

    it('should return empty string for undefined input', () => {
      expect(formatFacilityList(undefined)).to.equal('');
    });

    it('should return empty string for empty array', () => {
      expect(formatFacilityList([])).to.equal('');
    });

    it('should return single facility name for one facility', () => {
      const facilities = ['VA Western New York health care'];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care',
      );
    });

    it('should format two facilities with "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care and VA Pacific Islands health care',
      );
    });

    it('should format three facilities with commas and "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
        'VA Central Ohio health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care, VA Pacific Islands health care, and VA Central Ohio health care',
      );
    });

    it('should format four or more facilities with commas and "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
        'VA Central Ohio health care',
        'VA Southern Nevada health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care, VA Pacific Islands health care, VA Central Ohio health care, and VA Southern Nevada health care',
      );
    });

    it('should handle facility names with special characters', () => {
      const facilities = [
        'VA St. Louis health care',
        "VA O'Malley Regional Medical Center",
      ];
      expect(formatFacilityList(facilities)).to.equal(
        "VA St. Louis health care and VA O'Malley Regional Medical Center",
      );
    });
  });
  it('should return empty string when facilities is null', () => {
    expect(formatFacilityUnorderedList(null)).to.equal('');
  });

  it('should return empty string when facilities is undefined', () => {
    expect(formatFacilityUnorderedList(undefined)).to.equal('');
  });

  it('should return empty string when facilities is an empty array', () => {
    expect(formatFacilityUnorderedList([])).to.equal('');
  });

  it('should render a single facility in an unordered list', () => {
    const facilities = ['VA Western New York health care'];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(1);
    expect(items[0].textContent).to.equal('VA Western New York health care');
  });

  it('should render multiple facilities in an unordered list', () => {
    const facilities = [
      'VA Western New York health care',
      'VA Pacific Islands health care',
      'VA Central Ohio health care',
    ];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(3);
    expect(items[0].textContent).to.equal('VA Western New York health care');
    expect(items[1].textContent).to.equal('VA Pacific Islands health care');
    expect(items[2].textContent).to.equal('VA Central Ohio health care');
  });

  it('should render two facilities in an unordered list', () => {
    const facilities = [
      'VA Western New York health care',
      'VA Pacific Islands health care',
    ];
    const { container } = render(formatFacilityUnorderedList(facilities));

    const list = container.querySelector('ul');
    const items = container.querySelectorAll('li');

    expect(list).to.exist;
    expect(items).to.have.lengthOf(2);
    expect(items[0].textContent).to.equal('VA Western New York health care');
    expect(items[1].textContent).to.equal('VA Pacific Islands health care');
  });
});

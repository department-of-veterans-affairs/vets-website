import { expect } from 'chai';
import {
  defaultBreadcrumbs,
  makeBreadcrumbs,
} from '../../components/Breadcrumbs';
import {
  DR_HEADING,
  NON_DR_HEADING,
} from '../../constants/results-content/common';
import { ROUTES } from '../../constants';

describe('makeBreadcrumbs', () => {
  describe('introduction page', () => {
    it('should return only the three basic breadcrumbs for introduction page', () => {
      expect(makeBreadcrumbs('', null, ROUTES.INTRODUCTION)).to.deep.equal([
        ...defaultBreadcrumbs,
      ]);
    });

    it('should return only basic breadcrumbs even when H1 is provided for introduction', () => {
      expect(
        makeBreadcrumbs('Some H1 Text', null, ROUTES.INTRODUCTION),
      ).to.deep.equal([...defaultBreadcrumbs]);
    });
  });

  describe('question page', () => {
    it('should return the three basic breadcrumbs plus a trailing breadcrumb for the route', () => {
      expect(
        makeBreadcrumbs('VA claim timeline', null, 'va-claim-timeline'),
      ).to.deep.equal([
        ...defaultBreadcrumbs,
        {
          href: '#',
          label: 'VA claim timeline',
        },
      ]);
    });
  });

  describe('DR results page', () => {
    it('should return the three basic breadcrumbs plus a trailing breadcrumb for DR results pages', () => {
      expect(
        makeBreadcrumbs('', 'RESULTS_2_3_S', ROUTES.RESULTS_DR),
      ).to.deep.equal([
        ...defaultBreadcrumbs,
        { href: '#', label: DR_HEADING },
      ]);
    });
  });

  describe('Non-DR results page', () => {
    it('should return the three basic breadcrumbs plus a trailing breadcrumb for non-DR results pages', () => {
      expect(
        makeBreadcrumbs('', 'RESULTS_1_1B', ROUTES.RESULTS_NON_DR),
      ).to.deep.equal([
        ...defaultBreadcrumbs,
        { href: '#', label: NON_DR_HEADING },
      ]);
    });
  });
});

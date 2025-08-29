import { useMemo } from 'react';
import {
  toSnakeLower,
  humanize,
  tagsForRecord,
  upperCaseFirstLetterOnly,
} from '../utils/helpers';

export default function useStudentFeedbackCards({
  allOpe6Complaints,
  facilityCode,
  complaintData,
}) {
  // Build a lookup from complaintData so we can display a nice label/definition
  const complaintLookup = useMemo(
    () => {
      const map = {};
      (complaintData || []).forEach(({ key, type, definition }) => {
        if (!key) return;
        map[toSnakeLower(key)] = {
          label: upperCaseFirstLetterOnly(type),
          definition: definition || '',
        };
      });
      return map;
    },
    [complaintData],
  );

  // Totals per year across ALL campuses — used for “Total complaints for the year”
  const totalsByYearAllCampuses = useMemo(
    () => {
      const byYear = {};
      allOpe6Complaints.forEach(rec => {
        const yr = new Date(rec.closed).getFullYear();
        byYear[yr] = (byYear[yr] || 0) + 1;
      });
      return byYear;
    },
    [allOpe6Complaints],
  );

  // Build a lookup of complaint counts by (year, category) across all campuses (OPE6)
  const countsByYearCatAllCampuses = useMemo(
    () => {
      const map = new Map(); // key: `${year}|${categoryLower}` -> count
      allOpe6Complaints.forEach(rec => {
        const yr = new Date(rec.closed).getFullYear();
        const cats = new Set(
          (rec.categories || []).map(c => String(c).toLowerCase()),
        );
        cats.forEach(cat => {
          const k = `${yr}|${cat}`;
          map.set(k, (map.get(k) || 0) + 1);
        });
      });
      return map;
    },
    [allOpe6Complaints],
  );

  // Per-(year, category) counts for THIS facility only
  const countsByYearCatThisFacility = useMemo(
    () => {
      const fac = String(facilityCode);
      const map = new Map(); // key: `${year}|${categoryLower}` -> count
      allOpe6Complaints.forEach(rec => {
        if (String(rec.facilityCode) !== fac) return;
        const yr = new Date(rec.closed).getFullYear();
        const cats = new Set(
          (rec.categories || []).map(c => String(c).toLowerCase()),
        );
        cats.forEach(cat => {
          const k = `${yr}|${cat}`;
          map.set(k, (map.get(k) || 0) + 1);
        });
      });
      return map;
    },
    [allOpe6Complaints, facilityCode],
  );

  // Build ONE CARD PER API RECORD (no merging)
  const cards = useMemo(
    () => {
      return allOpe6Complaints.map((rec, idx) => {
        const year = new Date(rec.closed).getFullYear();
        const categories = tagsForRecord(rec);
        const primary = categories[0] || 'other'; // pick first category as the "primary" for label
        const lookup = complaintLookup[primary] || {};
        const keyForCounts = `${year}|${primary}`;

        return {
          id: `${rec.closed}-${rec.facilityCode}-${idx}`,
          year,
          closed: rec.closed,
          key: primary,
          label: lookup.label || humanize(primary),
          definition: lookup.definition || '', // OPE6-wide total records in this year
          totalYear: totalsByYearAllCampuses[year] || 0, // count of records at THIS facility in this year that include this category
          campusCount: countsByYearCatThisFacility.get(keyForCounts) || 0, // count of records OPE6-wide in this year that include this category
          allCampusCount: countsByYearCatAllCampuses.get(keyForCounts) || 0, // tags on the card
          coCategories: categories,
        };
      });
    },
    [
      allOpe6Complaints,
      complaintLookup,
      totalsByYearAllCampuses,
      countsByYearCatAllCampuses,
      countsByYearCatThisFacility,
    ],
  );

  // Years shown in the “Complaint year” filter = distinct years
  const availableYears = useMemo(
    () => {
      const years = new Set(
        allOpe6Complaints.map(r => new Date(r.closed).getFullYear()),
      );
      return Array.from(years).sort((a, b) => b - a);
    },
    [allOpe6Complaints],
  );

  // Type filter options = union of all tags shown on cards
  const availableTypes = useMemo(
    () => {
      const set = new Set();
      cards.forEach(c => (c.coCategories || []).forEach(tag => set.add(tag)));
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    },
    [cards],
  );

  return { cards, availableYears, availableTypes };
}

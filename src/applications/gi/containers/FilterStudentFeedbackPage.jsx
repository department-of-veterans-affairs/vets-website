import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaLoadingIndicator,
  VaSelect,
  VaAccordion,
  VaAccordionItem,
  VaCheckboxGroup,
  VaCheckbox,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Element as ScrollElement, scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import camelCase from 'lodash/camelCase';
import StudentFeedbackCardGrid from '../components/profile/StudentFeedbackCardGrid';

import { fetchProfile } from '../actions';
import ServiceError from '../components/ServiceError';
import { complaintData } from '../constants';

export default function FilterStudentFeedbackPage() {
  const { facilityCode } = useParams();
  const version = new URLSearchParams(useLocation().search).get('version');
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  const institutionName = profile?.attributes?.name || 'this institution';
  // const allCampusComplaintCounts = profile?.attributes?.complaints || {};
  // const allFacilityCodeComplaints =
  //   profile?.attributes?.allFacilityCodeComplaints ?? [];
  const allOpe6Complaints = profile?.attributes?.allOpe6Complaints ?? [];

  useEffect(() => {
    dispatch(fetchProfile(facilityCode, version));
  }, [dispatch, facilityCode, version]);

  useEffect(() => {
    if (!profile.inProgress) {
      scrollTo('filterFeedbackPage');
      focusElement('h1');
    }
  }, [profile.inProgress]);

  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = e => setIsSmallScreen(e.matches);
    // support older browsers
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  const norm = s => camelCase(s);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  // ── Applied filter state (used to filter data) ──────────────────────
  const [selectedYears, setSelectedYears] = useState(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());

  // ── UI (pending) filter state controlled by checkboxes ─────────────
  const [uiYears, setUiYears] = useState(() => new Set());
  const [uiTypes, setUiTypes] = useState(() => new Set());

  // const yearlyStats = useMemo(
  //   () => {
  //     /*
  //  * shape:
  //  * {
  //  *   2023: {
  //  *     totalCampus: 17,
  //  *     financial: { campus: 9, all: 12 },
  //  *     refund:    { campus: 3, all:  5 },
  //  *     …
  //  *   },
  //  *   …
  //  * }
  //  */
  //     const stats = {};
  //     const ensure = (yr, cat) => {
  //       if (!stats[yr])
  //         stats[yr] = {
  //           totalCampus: 0,
  //         };
  //       if (!stats[yr][cat])
  //         stats[yr][cat] = {
  //           campus: 0,
  //           all: 0,
  //         };
  //     };

  //     // ──  counts for THIS campus  ──────────────────────────────────────────────
  //     allFacilityCodeComplaints.forEach(rec => {
  //       const yr = new Date(rec.closed).getFullYear();
  //       stats[yr] = stats[yr] || {
  //         totalCampus: 0,
  //       };
  //       stats[yr].totalCampus += 1;

  //       // a Set removes any duplicate category names inside the same record
  //       new Set(rec.categories.map(norm)).forEach(cat => {
  //         ensure(yr, cat);
  //         stats[yr][cat].campus += 1;
  //       });
  //     });

  //     // ──  counts for ALL campuses that share the OPE-6  ────────────────────────
  //     allOpe6Complaints.forEach(rec => {
  //       const yr = new Date(rec.closed).getFullYear();

  //       new Set(rec.categories.map(norm)).forEach(cat => {
  //         ensure(yr, cat);
  //         stats[yr][cat].all += 1;
  //       });
  //     });

  //     return stats;
  //   },
  //   [allFacilityCodeComplaints, allOpe6Complaints],
  // );
  const yearlyStats = useMemo(() => {
    // shape: { [year]: { totalCampus, [category]: { campus, all } } }
    const stats = {};
    const ensure = (yr, cat) => {
      if (!stats[yr]) stats[yr] = { totalCampus: 0 };
      if (!stats[yr][cat]) stats[yr][cat] = { campus: 0, all: 0 };
    };

    const thisFac = String(facilityCode); // from useParams()

    allOpe6Complaints.forEach(rec => {
      const yr = new Date(rec.closed).getFullYear();
      const cats = new Set(rec.categories.map(norm)); // norm = camelCase
      const isThisCampus = String(rec.facilityCode) === thisFac;

      // totalYear = complaints at THIS campus only
      if (isThisCampus) {
        stats[yr] = stats[yr] || { totalCampus: 0 };
        stats[yr].totalCampus += 1;
      }

      cats.forEach(cat => {
        ensure(yr, cat);
        stats[yr][cat].all += 1; // OPE6-wide
        if (isThisCampus) stats[yr][cat].campus += 1; // this campus only
      });
    });

    return stats;
  }, [allOpe6Complaints, facilityCode]);

  // const coCategoriesByYearAndPrimary = useMemo(
  //   () => {
  //     const map = new Map(); // “YYYY|primary”  →  Set<categories>

  //     // look at both this-campus and sibling-campus complaints
  //     const source = allFacilityCodeComplaints;

  //     source.forEach(rec => {
  //       const yr = new Date(rec.closed).getFullYear();

  //       rec.categories.forEach(primary => {
  //         const key = `${yr}|${primary}`;
  //         const out = map.get(key) || new Set();

  //         // add every category in the record, incl. the primary itself
  //         rec.categories.forEach(cat => out.add(cat));

  //         map.set(key, out);
  //       });
  //     });

  //     return map;
  //   },
  //   [allFacilityCodeComplaints],
  // );
  const coCategoriesByYearAndPrimary = useMemo(() => {
    // key: "YYYY|primaryCategory" (camelCased)
    const map = new Map();
    allOpe6Complaints.forEach(rec => {
      const yr = new Date(rec.closed).getFullYear();
      const cats = new Set(rec.categories.map(norm)); // normalize to camelCase
      cats.forEach(primary => {
        const key = `${yr}|${primary}`;
        const out = map.get(key) || new Set();
        cats.forEach(cat => out.add(cat)); // include primary itself so every card has at least one tag
        map.set(key, out);
      });
    });
    return map;
  }, [allOpe6Complaints]);

  // flatten stats -> cards with co-categories
  // const cards = useMemo(
  //   () =>
  //     Object.keys(yearlyStats)
  //       .map(Number)
  //       .sort((a, b) => b - a)
  //       // newest year first
  //       .flatMap(year =>
  //         complaintData
  //           .map(({ key, type, definition }) => {
  //             const stat = yearlyStats[year][key] || {
  //               campus: 0,
  //               all: 0,
  //             };
  //             if (!stat.campus) return null; // no campus complaints for this [year, category]
  //             const coKey = `${year}|${key}`;
  //             const coSet =
  //               coCategoriesByYearAndPrimary.get(coKey) || new Set();
  //             const coList = Array.from(coSet).sort((a, b) =>
  //               a.localeCompare(b),
  //             );
  //             if (coList.length === 0) coList.push(key);

  //             return {
  //               id: `${year}-${key}`,
  //               year,
  //               key,
  //               label: type,
  //               definition,
  //               totalYear: yearlyStats[year].totalCampus,
  //               campusCount: stat.campus,
  //               allCampusCount: stat.all,
  //               coCategories: coList,
  //             };
  //           })
  //           .filter(Boolean),
  //       ),
  //   [yearlyStats, coCategoriesByYearAndPrimary],
  // );
  const cards = useMemo(
    () =>
      Object.keys(yearlyStats)
        .map(Number)
        .sort((a, b) => b - a)
        .flatMap(year =>
          complaintData
            .map(({ key, type, definition }) => {
              const keyNorm = camelCase(key); // align with stats keys
              const stat = yearlyStats[year][keyNorm] || {
                campus: 0,
                all: 0,
              };

              // keep the card if the category happened anywhere in OPE6 for that year
              const hasAny = stat.campus > 0 || stat.all > 0;
              if (!hasAny) return null;

              const coKey = `${year}|${keyNorm}`;
              const coSet =
                coCategoriesByYearAndPrimary.get(coKey) || new Set();
              const coList = Array.from(coSet).sort((a, b) =>
                a.localeCompare(b),
              );
              if (coList.length === 0) coList.push(keyNorm);

              return {
                id: `${year}-${keyNorm}`,
                year,
                key: keyNorm,
                label: type,
                definition,
                totalYear: yearlyStats[year].totalCampus, // this campus only
                campusCount: stat.campus, // only matching facilityCode
                allCampusCount: stat.all, // OPE6-wide
                coCategories: coList,
              };
            })
            .filter(Boolean),
        ),
    [yearlyStats, coCategoriesByYearAndPrimary, complaintData],
  );

  // Years shown in the “Complaint year” filter
  // const availableYears = useMemo(
  //   () => {
  //     const years = new Set(
  //       allFacilityCodeComplaints.map(rec =>
  //         new Date(rec.closed).getFullYear(),
  //       ),
  //     );
  //     return Array.from(years).sort((a, b) => b - a); // newest → oldest
  //   },
  //   [allFacilityCodeComplaints],
  // );

  const availableYears = useMemo(() => {
    const years = new Set(
      allOpe6Complaints.map(rec => new Date(rec.closed).getFullYear()),
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [allOpe6Complaints]);

  const availableTypes = useMemo(() => {
    const set = new Set();
    cards.forEach(c => (c.coCategories || []).forEach(tag => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cards]);

  const filteredCards = useMemo(() => {
    const yearActive = selectedYears.size > 0;
    const typeActive = selectedTypes.size > 0;
    return cards.filter(c => {
      const yearOk = yearActive ? selectedYears.has(c.year) : true;

      const typeOk = typeActive
        ? (c.coCategories || []).some(tag => selectedTypes.has(tag))
        : true;

      return yearOk && typeOk;
    });
  }, [cards, selectedYears, selectedTypes]);

  const sortedCards = useMemo(
    () =>
      [...filteredCards].sort((a, b) =>
        sortOrder === 'asc'
          ? a.label.localeCompare(b.label)
          : b.label.localeCompare(a.label),
      ),
    [filteredCards, sortOrder],
  );
  const totalResults = sortedCards.length;
  const totalPages = Math.ceil(totalResults / PER_PAGE);
  const pageCards = sortedCards.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const rangeStart = (currentPage - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * PER_PAGE, totalResults);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, selectedYears, selectedTypes]);

  if (profile.error) return <ServiceError />;
  if (profile.inProgress || !profile.attributes) {
    return (
      <VaLoadingIndicator
        data-testid="loading-indicator"
        message="Loading student feedback…"
      />
    );
  }

  const toggleUiYear = (year, checked) => {
    setUiYears(prev => {
      const next = new Set(prev);
      if (checked) next.add(year);
      else next.delete(year);
      return next;
    });
  };

  const toggleUiType = (key, checked) => {
    setUiTypes(prev => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const applyFilters = () => {
    setSelectedYears(new Set(uiYears));
    setSelectedTypes(new Set(uiTypes));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setUiYears(new Set());
    setUiTypes(new Set());
    setSelectedYears(new Set());
    setSelectedTypes(new Set());
    setCurrentPage(1);
  };

  const makeFilterPhrase = () => {
    const items = [
      ...Array.from(selectedYears).sort((a, b) => a - b),
      ...Array.from(selectedTypes) // years
        .sort((a, b) => a.localeCompare(b))
        .map(t => t.replace(/_/g, ' ')),
    ];

    if (items.length === 0) return null;

    const filterCount = items.length;
    return (
      <>
        {' for '}
        {items.map((v, idx) => (
          <span key={idx}>
            &ldquo;
            <strong>{v}</strong>
            &rdquo;
            {idx < items.length - 1 && ' '}
          </span>
        ))}
        {`with ${filterCount} filter${filterCount > 1 ? 's' : ''} applied`}
      </>
    );
  };
  const appliedFilterCount = selectedYears.size + selectedTypes.size;
  return (
    <ScrollElement name="filterFeedbackPage">
      <div className="vads-l-grid-container">
        <h1 className="vads-u-margin-bottom--3">
          {`Filter student feedback and complaints data for ${institutionName}`}
        </h1>

        <div className="vads-l-row vads-u-flex--wrap">
          <div className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-margin-bottom--3 vads-u-padding-right--3">
            <h2 className="vads-u-margin-bottom--3">
              Filters
              {appliedFilterCount > 0 && ` (${appliedFilterCount})`}
            </h2>
            <VaAccordion uswds openSingle>
              <VaAccordionItem header="Complaint year" level={3}>
                <VaCheckboxGroup uswds name="year-filters">
                  <VaCheckbox
                    uswds
                    label="All complaint years"
                    checked={uiYears.size === 0}
                    onVaChange={e => {
                      if (e.detail.checked) {
                        setUiYears(new Set());
                      }
                    }}
                  />

                  {availableYears.map(yr => (
                    <VaCheckbox
                      key={yr}
                      uswds
                      label={String(yr)}
                      checked={uiYears.has(yr)}
                      onVaChange={e => toggleUiYear(yr, e.detail.checked)}
                    />
                  ))}
                </VaCheckboxGroup>
              </VaAccordionItem>
            </VaAccordion>
            <VaAccordion uswds openSingle>
              <VaAccordionItem header="Complaint type" level={3}>
                <VaCheckboxGroup uswds name="type-filters">
                  <VaCheckbox
                    uswds
                    label="All complaint types"
                    checked={uiTypes.size === 0}
                    onVaChange={e => {
                      if (e.detail.checked) {
                        setUiTypes(new Set());
                      }
                    }}
                  />

                  {availableTypes.map(tag => (
                    <VaCheckbox
                      key={tag}
                      uswds
                      label={tag
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, m => m.toUpperCase())}
                      checked={uiTypes.has(tag)}
                      onVaChange={e => toggleUiType(tag, e.detail.checked)}
                    />
                  ))}
                </VaCheckboxGroup>
              </VaAccordionItem>
            </VaAccordion>

            <div className=" vads-u-margin-top--2">
              <VaButton
                text="Apply filters"
                onClick={applyFilters}
                uswds
                fullWidth
              />
              <div className=" vads-u-margin-top--1">
                <VaButton
                  text="Clear filters"
                  secondary
                  onClick={clearFilters}
                  uswds
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <h2 className="vads-u-margin-bottom--3">Filter Results</h2>
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--1">
              <span className="vads-u-margin-right--1">Sort</span>

              <VaSelect
                uswds
                name="sort-order"
                value={sortOrder}
                onVaSelect={e => setSortOrder(e.detail.value)}
                style={{ width: '10rem' }} /* ← slightly wider */
              >
                <option value="asc">a-z</option>
                <option value="desc">z-a</option>
              </VaSelect>
            </div>

            <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
              {totalResults > 0 ? (
                <>
                  {`Showing ${rangeStart}–${rangeEnd} of ${totalResults} results`}
                  {makeFilterPhrase()}
                </>
              ) : (
                'Showing 0 results'
              )}
            </p>
            <StudentFeedbackCardGrid
              pageCards={pageCards}
              isSmallScreen={isSmallScreen}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageSelect={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </ScrollElement>
  );
}
// allOpe6Complaints

// [
//   {
//     ope: '01072795',
//     ope6: '10727',
//     closed: '2020-04-17',
//     facilityCode: '21376032',
//     categories: ['other'],
//   },
//   {
//     ope: '01072795',
//     ope6: '10727',
//     closed: '2022-04-19',
//     facilityCode: '21376032',
//     categories: ['other'],
//   },
//   {
//     ope: '01072707',
//     ope6: '10727',
//     closed: '2020-07-10',
//     facilityCode: '21804505',
//     categories: ['quality', 'other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-05-18',
//     facilityCode: '21805113',
//     categories: ['other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-07-11',
//     facilityCode: '21805113',
//     categories: ['marketing', 'other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-10-18',
//     facilityCode: '21805113',
//     categories: ['financial', 'marketing', 'other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-08-10',
//     facilityCode: '21805113',
//     categories: ['financial', 'quality', 'refund', 'marketing'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-11-18',
//     facilityCode: '21805113',
//     categories: ['other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2023-11-28',
//     facilityCode: '21805113',
//     categories: ['financial', 'quality', 'other'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2020-10-29',
//     facilityCode: '21805113',
//     categories: ['refund'],
//   },
//   {
//     ope: '01072731',
//     ope6: '10727',
//     closed: '2022-01-20',
//     facilityCode: '21805113',
//     categories: ['financial', 'refund', 'other'],
//   },
//   {
//     ope: '01072714',
//     ope6: '10727',
//     closed: '2022-12-30',
//     facilityCode: '21807411',
//     categories: ['financial'],
//   },
//   {
//     ope: '01072700',
//     ope6: '10727',
//     closed: '2023-02-13',
//     facilityCode: '21900113',
//     categories: ['other'],
//   },
//   {
//     ope: '01072725',
//     ope6: '10727',
//     closed: '2019-07-31',
//     facilityCode: '21012046',
//     categories: ['other'],
//   },
//   {
//     ope: '01072705',
//     ope6: '10727',
//     closed: '2022-05-03',
//     facilityCode: '21800805',
//     categories: ['other'],
//   },
//   {
//     ope: '01072700',
//     ope6: '10727',
//     closed: '2022-03-14',
//     facilityCode: '21900113',
//     categories: ['marketing', 'other'],
//   },
//   {
//     ope: '01072715',
//     ope6: '10727',
//     closed: '2022-07-07',
//     facilityCode: '21913113',
//     categories: ['degree_requirements', 'other'],
//   },
//   {
//     ope: '01072712',
//     ope6: '10727',
//     closed: '2022-07-26',
//     facilityCode: '21059010',
//     categories: ['marketing'],
//   },
//   {
//     ope: '01072780',
//     ope6: '10727',
//     closed: '2022-03-31',
//     facilityCode: '21079542',
//     categories: ['quality', 'refund', 'other'],
//   },
//   {
//     ope: '01072727',
//     ope6: '10727',
//     closed: '2024-08-13',
//     facilityCode: '21800205',
//     categories: ['degree_requirements'],
//   },
// ];

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

import StudentFeedbackCardGrid from '../components/profile/StudentFeedbackCardGrid';
import { fetchProfile } from '../actions';
import ServiceError from '../components/ServiceError';
import { complaintData } from '../constants';
import { upperCaseFirstLetterOnly } from '../utils/helpers';

import useStudentFeedbackCards from '../hooks/useStudentFeedbackCards';

export default function FilterStudentFeedbackPage() {
  const { facilityCode } = useParams();
  const { search } = useLocation();
  const version = useMemo(() => new URLSearchParams(search).get('version'), [
    search,
  ]);
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);

  const institutionName = profile?.attributes?.name || 'this institution';
  const allOpe6Complaints = profile?.attributes?.allOpe6Complaints ?? [];

  useEffect(
    () => {
      dispatch(fetchProfile(facilityCode, version));
    },
    [dispatch, facilityCode, version],
  );

  useEffect(
    () => {
      if (!profile.inProgress) {
        scrollTo('filterFeedbackPage');
        focusElement('h1');
      }
    },
    [profile.inProgress],
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia('(max-width: 767px)').matches
        : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = e => setIsSmallScreen(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Build cards + filter options via hook (same logic as before)
  const {
    cards = [],
    availableYears = [],
    availableTypes = [],
  } = useStudentFeedbackCards({
    allOpe6Complaints,
    facilityCode,
    complaintData,
  });

  // UI state
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  // ── Applied filter state (used to filter data) ──────────────────────
  const [selectedYears, setSelectedYears] = useState(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());

  // ── UI (pending) filter state controlled by checkboxes ─────────────
  const [uiYears, setUiYears] = useState(() => new Set());
  const [uiTypes, setUiTypes] = useState(() => new Set());

  const filteredCards = useMemo(
    () => {
      const yearActive = selectedYears.size > 0;
      const typeActive = selectedTypes.size > 0;
      return cards.filter(c => {
        const yearOk = yearActive ? selectedYears.has(c.year) : true;
        const typeOk = typeActive
          ? (c.coCategories || []).some(tag => selectedTypes.has(tag))
          : true;
        return yearOk && typeOk;
      });
    },
    [cards, selectedYears, selectedTypes],
  );

  const sortedCards = useMemo(
    () =>
      [...filteredCards].sort(
        (a, b) =>
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
  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * PER_PAGE, totalResults);

  useEffect(
    () => {
      setCurrentPage(1);
    },
    [sortOrder, selectedYears, selectedTypes],
  );

  if (profile.error) return <ServiceError />;
  if (profile.inProgress || !profile.attributes) {
    return (
      <VaLoadingIndicator
        data-testid="loading-indicator"
        message="Loading student feedback…"
      />
    );
  }

  const focusResults = () => {
    requestAnimationFrame(() => focusElement('#results-summary'));
  };

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
    focusResults();
  };

  const clearFilters = () => {
    setUiYears(new Set());
    setUiTypes(new Set());
    setSelectedYears(new Set());
    setSelectedTypes(new Set());
    setCurrentPage(1);
    focusResults();
  };

  const makeFilterPhrase = () => {
    const items = [
      ...Array.from(selectedYears).sort((a, b) => a - b),
      ...Array.from(selectedTypes)
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
        ))}{' '}
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
              {`Filters${
                appliedFilterCount > 0 ? ` (${appliedFilterCount})` : ''
              }`}
            </h2>

            <VaAccordion uswds openSingle>
              <VaAccordionItem header="Complaint year" level={3}>
                <VaCheckboxGroup
                  uswds
                  name="year-filters"
                  className="vads-u-margin-top--0"
                >
                  <VaCheckbox
                    uswds
                    label="All complaint years"
                    checked={uiYears.size === 0}
                    onVaChange={e => {
                      if (e.detail.checked) setUiYears(new Set());
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
                <VaCheckboxGroup
                  uswds
                  name="type-filters"
                  className="vads-u-margin-top--0"
                >
                  <VaCheckbox
                    uswds
                    label="All complaint types"
                    checked={uiTypes.size === 0}
                    onVaChange={e => {
                      if (e.detail.checked) setUiTypes(new Set());
                    }}
                  />
                  {availableTypes.map(tag => (
                    <VaCheckbox
                      key={tag}
                      uswds
                      label={upperCaseFirstLetterOnly(
                        tag.replace(/_/g, ' ').trim(),
                      )}
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
            <h2 className="vads-u-margin-bottom--3">Filter results</h2>

            <div className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--1">
              <VaSelect
                className="vads-u-display--flex vads-u-align-items--baseline filter-student-feedback-sort-select"
                uswds
                label="Sort"
                name="sort-order"
                value={sortOrder}
                onVaSelect={e => {
                  setSortOrder(e.detail.value);
                  focusResults();
                }}
              >
                <option value="asc">a-z</option>
                <option value="desc">z-a</option>
              </VaSelect>
            </div>

            <p
              id="results-summary"
              tabIndex="-1"
              aria-atomic="true"
              className="vads-u-margin-top--0 vads-u-margin-bottom--3"
            >
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
              onPageSelect={page => {
                setCurrentPage(page);
                focusResults();
              }}
            />
          </div>
        </div>
      </div>
    </ScrollElement>
  );
}

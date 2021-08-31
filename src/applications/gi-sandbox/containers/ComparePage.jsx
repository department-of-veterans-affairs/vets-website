import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import appendQuery from 'append-query';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  fetchProfile,
  setPageTitle,
  showModal,
  hideModal,
  fetchCompareDetails,
  removeCompareInstitution,
} from '../actions';
import { estimatedBenefits } from '../selectors/estimator';
import { getCalculatedBenefits } from '../selectors/calculator';
import { getCompareCalculatorState } from '../selectors/compare';
import ServiceError from '../components/ServiceError';
import RemoveCompareSelectedModal from '../components/RemoveCompareSelectedModal';
import { MINIMUM_RATING_COUNT } from '../constants';
import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import CompareHeader from '../components/CompareHeader';
import CompareLayout from './CompareLayout';
import { isSmallScreen } from '../utils/helpers';

const scroll = Scroll.animateScroll;

export function ComparePage({
  allLoaded,
  compare,
  dispatchFetchCompareDetails,
  dispatchRemoveCompareInstitution,
  estimated,
  filters,
  gibctSchoolRatings,
  preview,
  calculated,
}) {
  const [showDifferences, setShowDifferences] = useState(false);
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [scrollTo, setScrollTo] = useState(null);
  const [initialTop, setInitialTop] = useState(null);
  const [currentXScroll, setCurrentXScroll] = useState(0);
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const headerRef = useRef(null);
  const scrollHeaderRef = useRef(null);
  const scrollPageRef = useRef(null);
  const { selected, error } = compare;
  const { loaded, institutions } = compare.details;
  const { version } = preview;
  const institutionCount = loaded.length;
  const history = useHistory();
  const hasScrollTo = scrollTo !== null;

  useEffect(
    () => {
      if (!allLoaded) {
        dispatchFetchCompareDetails(selected, filters, version);
      }
    },
    [allLoaded, dispatchFetchCompareDetails, filters, selected, version],
  );

  useEffect(
    () => {
      if (hasScrollTo) {
        scrollPageRef.current.scroll({
          left: scrollTo,
          behavior: 'smooth',
        });

        if (headerFixed) {
          scrollHeaderRef.current.scroll({
            left: scrollTo,
            behavior: 'smooth',
          });
        }

        setScrollTo(null);
      }
    },
    [scrollTo],
  );

  useEffect(() => {
    const checkSize = () => {
      setSmallScreen(isSmallScreen());
    };
    window.addEventListener('resize', checkSize);

    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const handleScroll = useCallback(
    () => {
      if (!initialTop && headerRef.current && headerRef.current.offsetTop) {
        setInitialTop(headerRef.current.offsetTop);
      }

      if (initialTop) {
        const offset = window.pageYOffset;
        const placeholder = document.querySelector('.placeholder.open');
        const footer = document.getElementById('footerNav');

        const visibleFooterHeight = footer
          ? window.innerHeight - footer.getBoundingClientRect().top
          : 0;
        if (offset > initialTop && !headerFixed) {
          setHeaderFixed(true);
          headerRef.current.classList.add('fixed');
          scrollHeaderRef.current.scroll({
            left: scrollPageRef.current.scrollLeft,
          });
        } else if (offset < initialTop && headerFixed) {
          setHeaderFixed(false);
          headerRef.current.classList.remove('fixed');
        } else if (headerFixed) {
          headerRef.current.style.top =
            visibleFooterHeight > 0 ? `${-visibleFooterHeight}px` : '0px';
        }

        if (placeholder) {
          placeholder.style.height = `${
            headerRef.current.getBoundingClientRect().height
          }px`;
        }
      }
    },
    [scrollHeaderRef, scrollPageRef, headerFixed, initialTop],
  );

  const handleBodyScrollReact = () => {
    if (
      headerFixed &&
      !hasScrollTo &&
      scrollHeaderRef.current.scrollLeft !== scrollPageRef.current.scrollLeft
    ) {
      scrollHeaderRef.current.scroll({
        left: scrollPageRef.current.scrollLeft,
      });
    }

    if (currentXScroll !== scrollPageRef.current.scrollLeft) {
      setCurrentXScroll(scrollPageRef.current.scrollLeft);
    }
  };

  const handleHeaderScrollReact = () => {
    if (
      headerFixed &&
      !hasScrollTo &&
      scrollHeaderRef.current.scrollLeft !== scrollPageRef.current.scrollLeft
    ) {
      scrollPageRef.current.scroll({
        left: scrollHeaderRef.current.scrollLeft,
      });
    }
  };

  const scrollClickHandler = scrollAmount => {
    setScrollTo(scrollAmount);
  };

  useEffect(() => {
    scroll.scrollToTop(getScrollOptions());
  }, []);

  useLayoutEffect(
    () => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    },
    [handleScroll],
  );

  if (error) {
    return <ServiceError />;
  }

  if (!allLoaded) {
    return <LoadingIndicator message="Loading..." />;
  }

  let hasRatings = false;
  const loadedInstitutions = [];
  for (let i = 0; i < loaded.length; i++) {
    loadedInstitutions.push(institutions[loaded[i]]);
    if (
      institutions[loaded[i]].institutionCategoryRatings.length > 0 &&
      institutions[loaded[i]].ratingCount >= MINIMUM_RATING_COUNT
    ) {
      hasRatings = true;
    }
  }

  return (
    <div
      className="compare-page"
      ref={scrollPageRef}
      onScroll={handleBodyScrollReact}
    >
      {promptingFacilityCode && (
        <RemoveCompareSelectedModal
          name={institutions[promptingFacilityCode].name}
          onClose={() => setPromptingFacilityCode(null)}
          onRemove={() => {
            setPromptingFacilityCode(null);
            const newSelected = selected.filter(
              facilityCode => facilityCode !== promptingFacilityCode,
            );
            const compareLink = version
              ? appendQuery(`/compare/?facilities=${newSelected.join(',')}`, {
                  version,
                })
              : appendQuery(`/compare/?facilities=${newSelected.join(',')}`);
            history.replace(compareLink);
            dispatchRemoveCompareInstitution(promptingFacilityCode);
          }}
          onCancel={() => setPromptingFacilityCode(null)}
        />
      )}
      <div className="content-wrapper">
        <div
          className={classNames('placeholder', {
            open: headerFixed,
          })}
        />
        <div id="compareHeader" ref={headerRef}>
          <div
            className={classNames('header-content-row', {
              'row vads-l-grid-container': !smallScreen,
            })}
          >
            <div
              ref={scrollHeaderRef}
              onScroll={handleHeaderScrollReact}
              className={classNames('compare-header-row', {
                'vads-l-row': !smallScreen,
                'vads-u-padding-bottom--6': !smallScreen,
              })}
            >
              <CompareHeader
                currentScroll={currentXScroll}
                institutions={loadedInstitutions}
                institutionCount={institutionCount}
                scrollClickHandler={scrollClickHandler}
                setShowDifferences={setShowDifferences}
                showDifferences={showDifferences}
                smallScreen={smallScreen}
                setPromptingFacilityCode={setPromptingFacilityCode}
                version={version}
              />
            </div>
          </div>
        </div>

        <CompareLayout
          calculated={calculated}
          estimated={estimated}
          showDifferences={showDifferences}
          hasRatings={hasRatings}
          smallScreen={smallScreen}
          institutions={loadedInstitutions}
          gibctSchoolRatings={gibctSchoolRatings}
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  const allLoaded =
    _.difference(state.compare.selected, state.compare.details.loaded)
      .length === 0;
  const estimated = {};
  const calculated = {};

  if (allLoaded) {
    state.compare.selected.forEach(facilityCode => {
      estimated[facilityCode] = estimatedBenefits(state, {
        institution: state.compare.details.institutions[facilityCode],
      });
      calculated[facilityCode] = getCalculatedBenefits({
        ...state,
        calculator: getCompareCalculatorState(
          state.calculator,
          state.compare.details.institutions[facilityCode],
          state.constants,
        ),
        profile: {
          attributes: state.compare.details.institutions[facilityCode],
        },
      });
    });
  }

  return {
    allLoaded,
    compare: state.compare,
    estimated,
    calculated,
    filters: state.filters,
    gibctSchoolRatings: toggleValues(state)[
      FEATURE_FLAG_NAMES.gibctSchoolRatings
    ],
    preview: state.preview,
  };
};

const mapDispatchToProps = {
  dispatchFetchCompareDetails: fetchCompareDetails,
  dispatchFetchProfile: fetchProfile,
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchSetPageTitle: setPageTitle,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComparePage);

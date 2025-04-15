import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useNavigate } from 'react-router-dom-v5-compat';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
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
import CompareHeader from '../components/CompareHeader';
import CompareLayout from './CompareLayout';
import { isSmallScreen } from '../utils/helpers';

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
  const navigate = useNavigate();
  const hasScrollTo = scrollTo !== null;
  const placeholderRef = useRef(null);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const giCtCollab = useToggleValue(TOGGLE_NAMES.giCtCollab);

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
      if (
        !initialTop &&
        headerRef.current &&
        headerRef.current.offsetTop &&
        placeholderRef.current
      ) {
        setInitialTop(headerRef.current.offsetTop);
      }

      if (initialTop) {
        const offset = window.pageYOffset;
        const footer = document.getElementById('footerNav');

        const visibleFooterHeight = footer
          ? window.innerHeight - footer.getBoundingClientRect().top
          : 0;
        const tooTall =
          headerRef.current.offsetHeight >= window.innerHeight / 2;

        if (offset > initialTop && !headerFixed && !tooTall) {
          setHeaderFixed(true);
          scrollHeaderRef.current.scroll({
            left: scrollPageRef.current.scrollLeft,
          });
          placeholderRef.current.style.height = `${
            headerRef.current.getBoundingClientRect().height
          }px`;
        } else if (offset < initialTop && headerFixed) {
          setHeaderFixed(false);
          placeholderRef.current.style.height = '0px';
        } else if (headerFixed) {
          headerRef.current.style.top =
            visibleFooterHeight > 0 ? `${-visibleFooterHeight}px` : '0px';
        }
      }
    },
    [scrollHeaderRef, scrollPageRef, headerFixed, initialTop, placeholderRef],
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
    scrollToTop();
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
    return (
      <VaLoadingIndicator
        data-testid="loading-indicator"
        message="Loading..."
      />
    );
  }

  const loadedInstitutions = [];
  for (let i = 0; i < loaded.length; i++) {
    loadedInstitutions.push(institutions[loaded[i]]);
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
            navigate(
              `${
                giCtCollab ? '/schools-and-employers' : ''
              }/compare/?facilities=${newSelected.join(',')}`,
            );
            dispatchRemoveCompareInstitution(promptingFacilityCode);
          }}
          onCancel={() => setPromptingFacilityCode(null)}
        />
      )}
      <div className="content-wrapper">
        <div ref={placeholderRef} className="placeholder">
          &nbsp;
        </div>
        <div
          id="compareHeader"
          ref={headerRef}
          className={classNames({ fixed: headerFixed })}
        >
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
  setPageTitle,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

ComparePage.propTypes = {
  allLoaded: PropTypes.bool.isRequired,
  calculated: PropTypes.object.isRequired,
  compare: PropTypes.object.isRequired,
  dispatchFetchCompareDetails: PropTypes.func.isRequired,
  dispatchRemoveCompareInstitution: PropTypes.func.isRequired,
  estimated: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  preview: PropTypes.object.isRequired,
  gibctSchoolRatings: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComparePage);

import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { removeCompareInstitution, compareDrawerOpened } from '../actions';
import RemoveCompareSelectedModal from '../components/RemoveCompareSelectedModal';
import { isSmallScreen } from '../utils/helpers';
import { updateUrlParams } from '../selectors/compare';

export function CompareDrawer({
  compare,
  dispatchRemoveCompareInstitution,
  displayed,
  alwaysDisplay = false,
  dispatchCompareDrawerOpened,
  preview,
}) {
  const history = useHistory();
  const { loaded, institutions } = compare.search;
  const { open } = compare;
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  const [stuck, setStuck] = useState(false);
  const placeholder = useRef(null);
  const drawer = useRef(null);
  const notRendered = !displayed && !alwaysDisplay;
  const [previousLoaded, setPreviousLoaded] = useState(loaded);
  const [previousInstitutions, setPreviousInstitutions] = useState(
    institutions,
  );
  const [loadedCards, setLoadedCards] = useState(null);
  const [headerLabel, setHeaderLabel] = useState(
    <>Compare Institutions ({loaded.length} of 3)</>,
  );
  const [sizeChanged, setSizeChanged] = useState(false);
  const tooTall = () => {
    // magic numbers based on rough heights of the drawer when expanded
    const maxDrawerHeight = isSmallScreen() ? 334 : 200;
    return open && maxDrawerHeight >= window.innerHeight;
  };
  const [scrollable, setScrollable] = useState(tooTall());

  const renderBlanks = () => {
    const blanks = [];
    for (let i = 0; i < 3 - loaded.length; i++) {
      blanks.push(
        <li
          key={i}
          className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
        >
          <div className="compare-name">
            <div className="blank" />
          </div>
        </li>,
      );
    }
    return blanks;
  };

  const [blanks, setBlanks] = useState(renderBlanks());

  const handleScroll = () => {
    let currentStuck;
    setStuck(currentState => {
      // Do not change the state by getting the updated state
      currentStuck = currentState;
      return currentState;
    });
    if (placeholder.current) {
      placeholder.current.style.height = currentStuck
        ? '0px'
        : `${drawer.current.getBoundingClientRect().height}px`;
      setStuck(
        placeholder.current.getBoundingClientRect().bottom < window.innerHeight,
      );
    }
  };

  const makeHeaderLabel = () => {
    const removed = [];
    const added = [];

    loaded.forEach(loadedCode => {
      if (
        previousLoaded.filter(previousCode => previousCode === loadedCode)
          .length === 0
      ) {
        added.push(loadedCode);
      }
    });

    previousLoaded.forEach(previousCode => {
      if (
        loaded.filter(loadedCode => previousCode === loadedCode).length === 0
      ) {
        removed.push(previousCode);
      }
    });

    let srActionMessage;
    if (added.length > 0) {
      srActionMessage = `${
        institutions[added[0]].name
      } added. Compare institutions, ${loaded.length} of 3.`;
    } else if (removed.length > 0) {
      srActionMessage = `${
        previousInstitutions[removed[0]].name
      } removed. Compare institutions, ${loaded.length} of 3.`;
    }

    setHeaderLabel(
      <>
        Compare institutions ({loaded.length} of 3)
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {srActionMessage}
        </span>
      </>,
    );
  };

  const makeLoadedCards = () => {
    setLoadedCards(
      loaded.map((facilityCode, index) => {
        return (
          <li
            className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
            key={index}
          >
            <div className="institution">
              <div className="compare-name">
                {institutions[facilityCode].name}
              </div>
              <div className="vads-u-padding-top--1p5">
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={() => {
                    setPromptingFacilityCode(facilityCode);
                  }}
                  aria-label={`Remove ${
                    institutions[facilityCode].name
                  } from comparison`}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      }),
    );
  };

  useEffect(
    () => {
      if (loaded.length === 0) {
        makeHeaderLabel();
        makeLoadedCards();
        setBlanks(renderBlanks());
        dispatchCompareDrawerOpened(false);
      } else if (loaded.length === 1 && !open) {
        dispatchCompareDrawerOpened(true);
        setTimeout(() => {
          makeHeaderLabel();
          makeLoadedCards();
          setBlanks(renderBlanks());
          setTimeout(() => {
            dispatchCompareDrawerOpened(false);
          }, 800);
        }, 300);
      } else if (loaded.length >= 1 && loaded.length <= 3) {
        makeHeaderLabel();
        makeLoadedCards();
        setBlanks(renderBlanks());
        dispatchCompareDrawerOpened(true);
      }

      setPreviousLoaded(loaded);
      setPreviousInstitutions(institutions);
    },
    [loaded],
  );

  useEffect(
    () => {
      if (sizeChanged) {
        setScrollable(tooTall());
        setSizeChanged(false);
      }
    },
    [sizeChanged],
  );

  const checkSize = () => {
    setSizeChanged(true);
  };

  useEffect(
    () => {
      checkSize();
    },
    [open],
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  if (notRendered) {
    return null;
  }

  const openCompare = () => {
    history.push(updateUrlParams(loaded, preview.version));
  };

  const headerLabelClasses = classNames('header-label', {
    open,
    closed: !open,
  });

  const expandOnClick = () => {
    dispatchCompareDrawerOpened(!open);
  };

  const compareDrawerClasses = classNames('compare-drawer', {
    stuck,
    scrollable,
  });
  const expandCollapse = classNames({
    'compare-drawer-collapsed': !open,
    'compare-drawer-expanded': open,
    floating: !stuck,
  });
  const compareHeaderClasses = classNames('compare-header', {
    'vads-l-grid-container': !isSmallScreen(),
  });
  const placeholderClasses = classNames('placeholder', {
    'drawer-open': open && !stuck,
    'drawer-stuck': stuck,
  });

  return (
    <>
      <div className={compareDrawerClasses} ref={drawer} id="compare-drawer">
        <div className={expandCollapse}>
          {promptingFacilityCode && (
            <RemoveCompareSelectedModal
              name={institutions[promptingFacilityCode].name}
              onClose={() => setPromptingFacilityCode(null)}
              onRemove={() => {
                setPromptingFacilityCode(null);
                dispatchRemoveCompareInstitution(promptingFacilityCode);
              }}
              onCancel={() => setPromptingFacilityCode(null)}
            />
          )}
          <div
            className={compareHeaderClasses}
            role="button"
            tabIndex={0}
            onClick={expandOnClick}
            onKeyDown={expandOnClick}
          >
            <button
              aria-expanded={open}
              aria-controls="compare-body"
              className={headerLabelClasses}
            >
              {headerLabel}
              <va-icon
                icon={open ? 'expand_more' : 'expand_less'}
                size={4}
                className="vads-u-padding-left--2"
              />
            </button>
          </div>

          {open && (
            <div className="compare-body vads-l-grid-container">
              <div className="small-function-label">
                You can compare 2 to 3 institutions
              </div>
              <div className="vads-l-row vads-u-padding-top--1">
                <ol id="compare-list-item" className="compare-list">
                  {loadedCards}
                  {blanks}
                </ol>

                <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3 action-cell compare-button">
                  <div className="large-function-label compare-name">
                    You can compare 2 to 3 institutions
                  </div>
                  <div>
                    <button
                      type="button"
                      className="usa-button vads-u-width--full"
                      disabled={loaded.length < 2}
                      onClick={openCompare}
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div ref={placeholder} className={placeholderClasses}>
        &nbsp;
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  compare: state.compare,
  preview: state.preview,
  displayed:
    state.search.location.results.length > 0 ||
    state.search.name.results.length > 0 ||
    state.compare.search.loaded.length > 0,
});

const mapDispatchToProps = {
  dispatchRemoveCompareInstitution: removeCompareInstitution,
  dispatchCompareDrawerOpened: compareDrawerOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompareDrawer);

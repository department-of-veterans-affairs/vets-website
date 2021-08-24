import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import appendQuery from 'append-query';
import { removeCompareInstitution, compareDrawerOpened } from '../actions';
import RemoveCompareSelectedModal from '../components/RemoveCompareSelectedModal';

export function CompareDrawer({
  compare,
  dispatchRemoveCompareInstitution,
  displayed,
  alwaysDisplay = false,
  dispatchCompareDrawerOpened,
  preview,
}) {
  const history = useHistory();
  const [open, setOpen] = useState(compare.open);
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  const [stuck, setStuck] = useState(false);
  const placeholder = useRef(null);
  const drawer = useRef(null);
  const notRendered = !displayed && !alwaysDisplay;
  const { loaded, institutions } = compare.search;
  const [loadedCards, setLoadedCards] = useState(null);
  const [headerLabel, setHeaderLabel] = useState(
    <>Compare Institutions ({loaded.length} of 3)</>,
  );

  const renderBlanks = () => {
    const blanks = [];
    for (let i = 0; i < 3 - loaded.length; i++) {
      blanks.push(
        <div
          key={i}
          className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
        >
          <div className="compare-name">
            <div className="blank" />
          </div>
        </div>,
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
    setHeaderLabel(<>Compare Institutions ({loaded.length} of 3)</>);
  };

  const makeLoadedCards = () => {
    setLoadedCards(
      loaded.map((facilityCode, index) => {
        return (
          <div
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
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      }),
    );
  };

  const expandCollapse = !open
    ? 'compare-drawer-collapsed'
    : 'compare-drawer-expanded';

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
    },
    [loaded],
  );
  useEffect(
    () => {
      setOpen(compare.open);
    },
    [compare.open],
  );
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);
  // function usePrevious(value) {
  //   const ref = useRef();
  //   useEffect(() => {
  //     ref.current = value.length;
  //   });

  //   return ref.current;
  // }

  // const prevCount = usePrevious(loaded);

  if (notRendered) {
    return null;
  }

  const openCompare = () => {
    const compareLink = preview.version
      ? appendQuery(`/compare/?facilities=${loaded.join(',')}`, {
          version: preview.version,
        })
      : appendQuery(`/compare/?facilities=${loaded.join(',')}`);
    history.push(compareLink);
  };

  const headerLabelClasses = classNames('header-label', {
    open,
    closed: !open,
  });

  // const renderBlanks = () => {
  //   const blanks = [];
  //   for (let i = 0; i < 3 - loaded.length; i++) {
  //     blanks.push(
  //       <div
  //         key={i}
  //         className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
  //       >
  //         <div className="compare-name">
  //           <div className="blank" />
  //         </div>
  //       </div>,
  //     );
  //   }
  //   return blanks;
  // };

  const expandOnClick = () => {
    setOpen(!open);
    dispatchCompareDrawerOpened(!open);
  };

  const compareDrawerClasses = classNames('compare-drawer', { stuck });
  const placeholderClasses = classNames('placeholder', {
    'drawer-open': open && !stuck,
    'drawer-stuck': stuck,
  });

  return (
    <>
      <div className={compareDrawerClasses} ref={drawer}>
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
            className="compare-header vads-l-grid-container"
            onClick={expandOnClick}
          >
            <div className={headerLabelClasses}>{headerLabel}</div>
          </div>

          <div className="compare-body vads-l-grid-container">
            <div className="small-function-label">
              You can compare 2 to 3 institutions
            </div>
            <div className="vads-l-row vads-u-padding-top--1">
              {loadedCards}

              {blanks}
              <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3 action-cell ">
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

// import React, { useEffect, useState, useRef } from 'react';
// import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import classNames from 'classnames';
// import appendQuery from 'append-query';
// import { removeCompareInstitution, compareDrawerOpened } from '../actions';
// import RemoveCompareSelectedModal from '../components/RemoveCompareSelectedModal';

// export function CompareDrawer({
//   compare,
//   dispatchRemoveCompareInstitution,
//   displayed,
//   alwaysDisplay = false,
//   dispatchCompareDrawerOpened,
//   preview,
// }) {
//   const history = useHistory();
//   const [open, setOpen] = useState(compare.open);
//   const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
//   const [stuck, setStuck] = useState(false);
//   const placeholder = useRef(null);
//   const drawer = useRef(null);
//   const notRendered = !displayed && !alwaysDisplay;
//   const { loaded, institutions } = compare.search;
//   const [loadedCards, setLoadedCards] = useState(null);
//   const [headerLabel, setHeaderLabel] = useState(
//     <>Compare Institutions ({loaded.length} of 3)</>,
//   );

//   const renderBlanks = () => {
//     const blanks = [];
//     for (let i = 0; i < 3 - loaded.length; i++) {
//       blanks.push(
//         <div
//           key={i}
//           className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
//         >
//           <div className="compare-name">
//             <div className="blank" />
//           </div>
//         </div>,
//       );
//     }
//     return blanks;
//   };

//   const [blanks, setBlanks] = useState(renderBlanks());

//   const handleScroll = () => {
//     let currentStuck;
//     setStuck(currentState => {
//       // Do not change the state by getting the updated state
//       currentStuck = currentState;
//       return currentState;
//     });
//     if (placeholder.current) {
//       placeholder.current.style.height = currentStuck
//         ? '0px'
//         : `${drawer.current.getBoundingClientRect().height}px`;
//       setStuck(
//         placeholder.current.getBoundingClientRect().bottom < window.innerHeight,
//       );
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll, true);

//     return () => {
//       window.removeEventListener('scroll', handleScroll, true);
//     };
//   }, []);

//   const makeHeaderLabel = () => {
//     setHeaderLabel(<>Compare Institutions ({loaded.length} of 3)</>);
//   };

//   const makeLoadedCards = () => {
//     setLoadedCards(
//       loaded.map((facilityCode, index) => {
//         return (
//           <div
//             className="compare-item vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3"
//             key={index}
//           >
//             <div className="institution">
//               <div className="compare-name">
//                 {institutions[facilityCode].name}
//               </div>
//               <div className="vads-u-padding-top--1p5">
//                 <button
//                   type="button"
//                   className="va-button-link learn-more-button"
//                   onClick={() => {
//                     setPromptingFacilityCode(facilityCode);
//                   }}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       }),
//     );
//   };

//   useEffect(
//     () => {
//       switch (loaded.length) {
//         case 0:
//           makeHeaderLabel();
//           makeLoadedCards();
//           setBlanks(renderBlanks());
//           dispatchCompareDrawerOpened(false);
//           break;
//         case 1:
//           setTimeout(() => {
//             makeHeaderLabel();
//             makeLoadedCards();
//             setBlanks(renderBlanks());
//             dispatchCompareDrawerOpened(true);
//             setTimeout(() => {
//               dispatchCompareDrawerOpened(false);
//             }, 800);
//           }, 300);
//           break;
//         default:
//           break;
//       }
//     },
//     [loaded],
//   );

//   useEffect(
//     () => {
//       setOpen(compare.open);
//     },
//     [compare.open],
//   );

//   if (notRendered) {
//     return null;
//   }

//   const openCompare = () => {
//     const compareLink = preview.version
//       ? appendQuery(`/compare/?facilities=${loaded.join(',')}`, {
//           version: preview.version,
//         })
//       : appendQuery(`/compare/?facilities=${loaded.join(',')}`);
//     history.push(compareLink);
//   };

//   const headerLabelClasses = classNames('header-label', {
//     open,
//     closed: !open,
//   });

//   const expandOnClick = () => {
//     setOpen(!open);
//     dispatchCompareDrawerOpened(!open);
//   };

//   const compareDrawerClasses = classNames('compare-drawer', { stuck });
//   const placeholderClasses = classNames('placeholder', {
//     'drawer-open': open && !stuck,
//     'drawer-stuck': stuck,
//   });
//   return (
//     <>
//       <div className={compareDrawerClasses} ref={drawer}>
//         {promptingFacilityCode && (
//           <RemoveCompareSelectedModal
//             name={institutions[promptingFacilityCode].name}
//             onClose={() => setPromptingFacilityCode(null)}
//             onRemove={() => {
//               setPromptingFacilityCode(null);
//               dispatchRemoveCompareInstitution(promptingFacilityCode);
//             }}
//             onCancel={() => setPromptingFacilityCode(null)}
//           />
//         )}
//         <div
//           className="compare-header vads-l-grid-container"
//           onClick={expandOnClick}
//         >
//           <div className={headerLabelClasses}>{headerLabel}</div>
//         </div>
//         {open && (
//           <div className="compare-body vads-l-grid-container">
//             <div className="small-function-label">
//               You can compare 2 to 3 institutions
//             </div>
//             <div className="vads-l-row vads-u-padding-top--1">
//               {loadedCards}

//               {blanks}

//               <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--3 action-cell ">
//                 <div className="large-function-label compare-name">
//                   You can compare 2 to 3 institutions
//                 </div>
//                 <div>
//                   <button
//                     type="button"
//                     className="usa-button vads-u-width--full"
//                     disabled={loaded.length < 2}
//                     onClick={openCompare}
//                   >
//                     Compare
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <div ref={placeholder} className={placeholderClasses}>
//         &nbsp;
//       </div>
//     </>
//   );
// }

// const mapStateToProps = state => ({
//   compare: state.compare,
//   preview: state.preview,
//   displayed:
//     state.search.location.results.length > 0 ||
//     state.search.name.results.length > 0 ||
//     state.compare.search.loaded.length > 0,
// });

// const mapDispatchToProps = {
//   dispatchRemoveCompareInstitution: removeCompareInstitution,
//   dispatchCompareDrawerOpened: compareDrawerOpened,
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(CompareDrawer);

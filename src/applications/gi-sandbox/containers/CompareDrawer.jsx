import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { removeCompareInstitution } from '../actions';

export function CompareDrawer({
  compare,
  dispatchRemoveCompareInstitution,
  displayed,
}) {
  const [open, setOpen] = useState(false);
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  const { loaded, institutions } = compare;

  if (!displayed) {
    return null;
  }

  const headerLabelClasses = classNames('header-label', {
    open,
    closed: !open,
  });

  const renderBlanks = () => {
    const blanks = [];
    for (let i = 0; i < 3 - loaded.length; i++) {
      blanks.push(
        <div key={i} className="medium-screen:vads-l-col--3">
          <div className="compare-name">
            <div className="blank" />
          </div>
        </div>,
      );
    }
    return blanks;
  };

  return (
    <div className="compare-drawer">
      <Modal
        onClose={() => setPromptingFacilityCode(null)}
        primaryButton={{
          action: () => {
            setPromptingFacilityCode(null);
            dispatchRemoveCompareInstitution(promptingFacilityCode);
          },
          text: 'Remove',
        }}
        secondaryButton={{
          action: () => setPromptingFacilityCode(null),
          text: 'Cancel',
        }}
        title="Remove Institution?"
        visible={promptingFacilityCode}
      >
        {promptingFacilityCode && (
          <p>
            Remove {institutions[promptingFacilityCode].name} from your
            comparison?
          </p>
        )}
      </Modal>
      <div
        className="compare-header vads-l-grid-container"
        onClick={() => setOpen(!open)}
      >
        <div className={headerLabelClasses}>
          Compare Institutions ({loaded.length} of 3)
        </div>
      </div>
      {open && (
        <div className="compare-body vads-l-grid-container">
          <div className="vads-l-row vads-u-padding-top--1">
            {loaded.map((facilityCode, index) => {
              return (
                <div className="medium-screen:vads-l-col--3" key={index}>
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
              );
            })}

            {renderBlanks()}

            <div className="medium-screen:vads-l-col--3 action-cell">
              <div className="compare-name">
                You can compare 2 to 3 institutions
              </div>
              <div>
                <button
                  type="button"
                  className="usa-button vads-u-width--full"
                  disabled={loaded.length < 2}
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  compare: state.compare,
  displayed:
    state.search.location.results.length > 0 ||
    state.search.name.results.length > 0,
});

const mapDispatchToProps = {
  dispatchRemoveCompareInstitution: removeCompareInstitution,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompareDrawer);

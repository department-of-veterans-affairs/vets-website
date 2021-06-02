import React, { useState } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { removeCompareInstitution } from '../actions';

export function CompareDrawer({
  compare,
  dispatchRemoveCompareInstitution,
  displayed,
}) {
  const [promptingFacilityCode, setPromptingFacilityCode] = useState(null);
  if (!displayed) {
    return null;
  }
  const { loaded, institutions } = compare;

  const open = compare.loaded.length > 1;
  return (
    <div className="compare-drawer row">
      <Modal
        onClose={() => setPromptingFacilityCode(null)}
        primaryButton={{
          action: () => {
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
      <div className="compare-header">
        Compare Institutions ({loaded.length} of 3)
      </div>
      {open && (
        <div className="compare-body vads-l-grid-container">
          <div className="vads-l-row vads-u-padding--1">
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

            {loaded.length === 2 && (
              <div className="medium-screen:vads-l-col--3">
                <div className="compare-name">
                  <div className="blank" />
                </div>
              </div>
            )}

            <div className="medium-screen:vads-l-col--3">
              <div className="compare-name">
                You can compare 2 to 3 institutions
              </div>
              <div>
                <button
                  type="button"
                  className="usa-button vads-u-width--full "
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

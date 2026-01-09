/* eslint-disable react/sort-prop-types */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder';

/**
 * Array builder cancel/save and continue buttons. May be used
 * as standalone components within a user-defined CustomPage within an
 * array builder. Ideally this would be moved inside the array builder
 * itself and provided as a prop that could be accessed, but for now
 * going with this approach locally so our form looks consistent.
 * @param {{
 *   arrayPath: string,
 *   getSummaryPath: () => string,
 *   getIntroPath: () => string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   getText: import('platform/forms-system/src/js/patterns/array-builder/arrayBuilderText').ArrayBuilderGetText,
 * }} props
 */
export default function CustomArrayBuilderButtonPair(props) {
  /*
  These are supplied via the array builder + passed to any
  custom pages that override the normal array builder page via the
  `arrayBuilder` prop (see CustomPage logic in arrayBuilder.jsx).
  */
  const {
    arrayPath,
    getSummaryPath,
    getIntroPath,
    reviewRoute,
    getText,
    required,
  } = props;
  const introRoute = getIntroPath();
  const summaryRoute = getSummaryPath();
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const NavButtons = props.NavButtons || FormNavButtons;

  // This ref allows us to listen for the "Continue" VaButton's onclick, which
  // lets us run consistent onclick logic (e.g., the same props.onContinue that
  // the normal NavButtons component uses)
  const contBtn = useRef(null);

  // Attach click listener (works for enter key and spacebar as well) to
  // the VaButton used to continue on edit pages.
  useEffect(() => {
    const handleContClick = _e => {
      props.onContinue(props);
    };
    if (contBtn.current) {
      contBtn.current.addEventListener('click', handleContClick);
    }
  }, []);

  return (
    <>
      {isAdd && (
        <>
          <ArrayBuilderCancelButton
            goToPath={props.goToPath}
            arrayPath={arrayPath}
            summaryRoute={summaryRoute}
            introRoute={introRoute}
            reviewRoute={reviewRoute}
            getText={getText}
            required={required}
          />
          {/* save-in-progress link, etc */}
          {props.pageContentBeforeButtons}
          {props.contentBeforeButtons}
          <NavButtons
            goBack={props.goBack}
            goForward={props.onContinue}
            submitToContinue
            useWebComponents={props.formOptions?.useWebComponentForNavigation}
          />
        </>
      )}
      {isEdit && (
        <div className="vads-u-display--flex">
          <div className="vads-u-margin-right--2">
            <ArrayBuilderCancelButton
              goToPath={props.goToPath}
              arrayPath={arrayPath}
              summaryRoute={summaryRoute}
              introRoute={introRoute}
              reviewRoute={reviewRoute}
              getText={getText}
              required={required}
              className="vads-u-margin-0"
            />
          </div>
          <div>
            <VaButton
              ref={contBtn} // Allows us to call `props.onContinue`
              continue
              submit="prevent"
              text={getText('editSaveButtonText')}
            />
          </div>
        </div>
      )}

      {props.contentAfterButtons}
    </>
  );
}

CustomArrayBuilderButtonPair.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  getSummaryPath: PropTypes.func,
  getIntroPath: PropTypes.func,
  required: PropTypes.func.isRequired,
  reviewRoute: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  formContext: PropTypes.object,
  formOptions: PropTypes.object,
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  onContinue: PropTypes.func,
  pageContentBeforeButtons: PropTypes.node,
  NavButtons: PropTypes.func,
  props: PropTypes.object,
};

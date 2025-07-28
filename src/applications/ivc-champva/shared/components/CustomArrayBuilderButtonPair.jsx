/* eslint-disable react/sort-prop-types */
import React from 'react';
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
 *   summaryRoute: string,
 *   introRoute?: string,
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
    summaryRoute,
    introRoute,
    reviewRoute,
    getText,
    required,
  } = props;
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');

  const NavButtons = props.NavButtons || FormNavButtons;

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
  summaryRoute: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  introRoute: PropTypes.string,
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

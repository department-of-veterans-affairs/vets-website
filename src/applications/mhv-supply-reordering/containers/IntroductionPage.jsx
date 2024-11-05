import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '~/platform/utilities/ui';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import { selectProfile } from '~/platform/user/selectors';
import SaveInProgressIntro from '~/platform/forms/save-in-progress/SaveInProgressIntro';
import { TITLE, SUBTITLE } from '../constants';
import UnavailableSupplies from '../components/UnavailableSupplies';
import MdotErrorMessage from '../components/MdotErrorMessage';
import IneligibleErrorMessage from '../components/IneligibleErrorMessage';
import {
  numAvailableSupplies,
  isEligible,
  getEligibilityDate,
} from '../utilities/mdot';

/**
 * Introduction page for the form.
 */
export const IntroductionPage = ({
  mdotIsError,
  mdotIsPending,
  route,
  mdotData,
  mdotErrorCode,
}) => {
  const profile = useSelector(selectProfile);
  const isLoading = profile.loading || mdotIsPending;
  const { formConfig, pageList } = route;
  const numAvailSupplies = numAvailableSupplies(mdotData);
  const showMdotError = !isLoading && mdotIsError;
  const showIneligibleError =
    !isLoading && !showMdotError && !isEligible(mdotData);
  const showForm = !isLoading && !showMdotError && !showIneligibleError;

  useEffect(
    () => {
      // For accessibility purposes.
      focusElement('h1');
    },
    [isLoading],
  );

  const loadingContent = (
    <div className="vads-u-margin--5">
      <va-loading-indicator
        data-testid="mhv-supply-intro-reorder-loading"
        message="Please wait while we load your information..."
      />
    </div>
  );

  return (
    <article className="schemaform-intro vads-u-padding--2">
      <FormTitle title={TITLE} />
      <p>{SUBTITLE}</p>
      {isLoading && loadingContent}
      {showMdotError && <MdotErrorMessage errorCode={mdotErrorCode} />}
      {showIneligibleError && (
        <IneligibleErrorMessage
          nextAvailabilityDate={getEligibilityDate(mdotData)}
        />
      )}
      {showForm && (
        <div data-testid="mhv-supply-intro-content">
          {numAvailSupplies > 0 && (
            <div>
              <va-card background>
                <h2>Available for reorder</h2>
                <p>
                  You have {numAvailSupplies}{' '}
                  {numAvailSupplies > 1 ? 'supplies' : 'supply'} available to
                  reorder
                </p>
                <SaveInProgressIntro
                  headingLevel={3}
                  prefillEnabled={formConfig.prefillEnabled}
                  messages={formConfig.savedFormMessages}
                  pageList={pageList}
                  startText="Start a new order"
                  formConfig={formConfig}
                />
              </va-card>
            </div>
          )}

          <va-alert status="warning" visible={numAvailSupplies === 0}>
            <h2 slot="headline">You have no available supplies to reorder</h2>
            <p>
              Check unavailable supplies and see what you can do to reorder if
              you need it now.
            </p>
          </va-alert>

          <UnavailableSupplies mdotData={mdotData} />
        </div>
      )}
    </article>
  );
};

IntroductionPage.propTypes = {
  mdotIsError: PropTypes.bool.isRequired,
  mdotIsPending: PropTypes.bool.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  mdotData: PropTypes.object,
  mdotErrorCode: PropTypes.string,
};

const mapStateToProps = state => ({
  mdotIsError: state.mdot.isError,
  mdotIsPending: state.mdot.pending,
  mdotData: state.mdot.data,
  mdotErrorCode: state.mdot.errorCode,
});

export default connect(mapStateToProps)(IntroductionPage);

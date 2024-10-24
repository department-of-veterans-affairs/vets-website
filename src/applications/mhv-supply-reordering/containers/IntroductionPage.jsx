import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
// import { useSelector } from 'react-redux';
// import { isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';
import UnavailableSupplies from '../components/UnavailableSupplies';
import { numAvailableSupplies, isEligible } from '../utilities/mdot';

/**
 * Introduction page for the form.
 */
export const IntroductionPage = props => {
  // const userLoggedIn = useSelector(state => isLoggedIn(state));
  const { route } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const { mdotData } = props;
  const numAvailSupplies = numAvailableSupplies(mdotData);
  const canOrderSupplies = isEligible(mdotData) && numAvailSupplies > 0;

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p>
        Use this form to order hearing aid batteries and accessories, and CPAP
        supplies.
      </p>
      {canOrderSupplies && (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start a new order"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}

      <va-alert status="warning" visible={!canOrderSupplies}>
        <h3 slot="headline">You have no available supplies to reorder</h3>
        <p>
          Check unavailable supplies and see what you can do to reorder if you
          need it now.
        </p>
      </va-alert>

      <UnavailableSupplies supplies={mdotData} />
    </article>
  );
};

IntroductionPage.propTypes = {
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
};

const mapStateToProps = state => ({
  mdotIsError: state.mdot.isError,
  mdotIsPending: state.mdot.pending,
  mdotData: state.mdot.data,
});

export default connect(mapStateToProps)(IntroductionPage);

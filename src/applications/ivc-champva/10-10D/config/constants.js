import PropTypes from 'prop-types';

// These proptypes are used with the custom pages that use ApplicantRelationshipPage
export const pageProps = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
export const reviewPageProps = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  props: PropTypes.object,
  title: PropTypes.func,
};

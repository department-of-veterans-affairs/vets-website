import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormButtons from '../../../components/FormButtons';
import { getFormPageInfo } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';
import { routeToPreviousAppointmentPage } from '../../redux/actions';
import { getPageTitle } from '../../newAppointmentFlow';

const pageKey = 'selectProvider';

export default function SelectProviderPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const dispatch = useDispatch();
  const { pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();

  useEffect(() => {
    // dispatch(openFormPage(pageKey, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <FormButtons
        onBack={() =>
          dispatch(routeToPreviousAppointmentPage(history, pageKey))
        }
        pageChangeInProgress={pageChangeInProgress}
        loadingText="Page change in progress"
      />
    </div>
  );
}

SelectProviderPage.propTypes = {
  changeCrumb: PropTypes.func,
};

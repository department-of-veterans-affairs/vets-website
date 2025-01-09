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
import ProviderCard from './ProviderCard';
import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';

const pageKey = 'selectProvider';

export default function SelectProviderPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const providers = [
    {
      name: 'Sarah Bennett, RD',
      lastAppointment: '9/12/2024',
    },
    {
      name: 'Julie Carson, RD',
      lastAppointment: '7/12/2024',
    },
  ];

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
      {providers.map((provider, index) => (
        <ProviderCard key={index} provider={provider} />
      ))}

      <ScheduleWithDifferentProvider />
    </div>
  );
}

SelectProviderPage.propTypes = {
  changeCrumb: PropTypes.func,
};

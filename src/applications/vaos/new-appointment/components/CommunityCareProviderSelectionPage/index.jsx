import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import FormButtons from '../../../components/FormButtons';
import { GA_PREFIX } from '../../../utils/constants';
import {
  openCommunityCareProviderSelectionPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../../redux/actions';
import { getFormPageInfo } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ProviderSelectionField from './ProviderSelectionField';
import { getPageTitle } from '../../newAppointmentFlow';

const initialSchema = {
  type: 'object',
  properties: {
    communityCareProvider: {
      type: 'object',
      properties: {},
    },
  },
};

const pageKey = 'ccPreferences';

export default function CommunityCareProviderSelectionPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const dispatch = useDispatch();
  const { data, pageChangeInProgress, schema } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();

  const uiSchema = {
    communityCareProvider: {
      'ui:field': ProviderSelectionField,
    },
  };

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    dispatch(
      openCommunityCareProviderSelectionPage(pageKey, uiSchema, initialSchema),
    );
    recordEvent({
      event: `${GA_PREFIX}-community-care-provider-selection-page`,
    });
  }, []);

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="ccPreferences"
          title="Which provider do you prefer?"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => {
            recordEvent({
              event:
                Object.keys(data.communityCareProvider).length === 0
                  ? `${GA_PREFIX}-continue-without-provider`
                  : `${GA_PREFIX}-continue-with-provider`,
            });
            dispatch(routeToNextAppointmentPage(history, pageKey));
          }}
          onChange={newData => {
            dispatch(updateFormData(pageKey, uiSchema, newData));
          }}
          data={data}
        >
          <va-additional-info
            trigger="What happens if you skip this step"
            class="vads-u-margin-y--4"
            data-testid="additional-info"
          >
            <div>
              We’ll choose the provider nearest to you who is available closest
              to your preferred time.{' '}
            </div>
          </va-additional-info>
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

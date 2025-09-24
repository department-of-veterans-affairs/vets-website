import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import useFormState from '../../hooks/useFormState';
import { focusFormHeader } from '../../utils/scrollAndFocus';
import { getPageTitle } from '../newAppointmentFlow';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import {
  getFormData,
  selectCommunityCareSupportedSites,
  selectPageChangeInProgress,
} from '../redux/selectors';
import AppointmentsRadioWidget from './AppointmentsRadioWidget';

const pageKey = 'ccClosestCity';

export default function ClosestCityStatePage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const uiSchema = {
    communityCareSystemId: {
      'ui:title': pageTitle,
      'ui:widget': AppointmentsRadioWidget,
      'ui:errorMessages': {
        required: 'Select a city',
      },
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        hideLabelText: true,
      },
    },
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const supportedParentSites = useSelector(selectCommunityCareSupportedSites);
  const initialData = useSelector(getFormData, shallowEqual);

  const { data, schema, setData } = useFormState({
    initialData,
    initialSchema() {
      return {
        type: 'object',
        required: ['communityCareSystemId'],
        properties: {
          communityCareSystemId: {
            type: 'string',
            enum: supportedParentSites.map(site => site.id),
            enumNames: supportedParentSites.map(
              site => `${site.address.city}, ${site.address.state}`,
            ),
          },
        },
      };
    },
    uiSchema,
  });

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
  }, []);

  useEffect(
    () => {
      if (schema) {
        focusFormHeader();
      }
    },
    [schema],
  );

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">
        {pageTitle}
        <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
          (*Required)
        </span>
      </h1>
      {!!schema && (
        <SchemaForm
          name="Closest city and state"
          title="Closest city and state"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => {
            dispatch(routeToNextAppointmentPage(history, pageKey, data));
          }}
          onChange={newData => setData(newData)}
          data={data}
        >
          <va-additional-info
            trigger="Why we’re asking this"
            class="vads-u-margin-bottom--4"
            data-testid="additional-info"
          >
            <div>
              We'll send your request to the VA medical center nearest to the
              city you select. The medical center staff will help schedule your
              community care appointment.{' '}
            </div>
          </va-additional-info>
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

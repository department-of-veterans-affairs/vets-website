import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import { TYPES_OF_EYE_CARE } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['typeOfEyeCareId'],
  properties: {
    typeOfEyeCareId: {
      type: 'string',
      enum: TYPES_OF_EYE_CARE.map(type => type.id),
    },
  },
};

const uiSchema = {
  typeOfEyeCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        [TYPES_OF_EYE_CARE[0].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_EYE_CARE[0].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              You can schedule an optometry appointment for a routine eye exam,
              eye test, or to treat conditions like glaucoma or low vision.
              Optometrists will also give you a prescription for eyeglasses or
              corrective lenses.
            </span>
          </>
        ),
        [TYPES_OF_EYE_CARE[1].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_EYE_CARE[1].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              You can schedule an ophthalmology appointment for the diagnosis
              and treatment of more serious eye conditions that may need
              surgery, like cataracts, macular degeneration, diabetic
              retinopathy, or other eye diseases.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfEyeCare';
const pageTitle = 'Choose the type of eye care you need';

export class TypeOfEyeCarePage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <SchemaForm
          name="Type of eye care"
          title="Type of eye care"
          schema={schema || initialSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFormData(pageKey, uiSchema, newData)
          }
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TypeOfEyeCarePage);

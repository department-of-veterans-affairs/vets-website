import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FORMAT_DATE_READABLE } from '../constants';

import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import get from 'platform/utilities/data/get';
import { isReactComponent } from 'platform/utilities/ui';

/**
 * Wraps an 'array' schema in separate accordion elements.
 */
export default class AccordionField extends React.Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  itemsOpen = [];
  togglingAll = false;

  constructor(props) {
    super(props);

    // Throw an error if there’s no viewComponent (should be React component)
    if (
      !isReactComponent(get('ui:options.viewComponent', this.props.uiSchema))
    ) {
      throw new Error(
        `No viewComponent found in uiSchema for ReviewBoxField ${
          this.props.idSchema.$id
        }.`,
      );
    }

    this.state = {
      collapseAll: false,
    };

    window.addEventListener('click', this.manuallyToggleCollapseLinkOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.manuallyToggleCollapseLinkOnClick);
  }

  getDescription = () => {
    const {
      uiSchema: { 'ui:description': description },
      formData,
    } = this.props;
    if (!description) {
      return null;
    }

    return typeof description === 'function' ? (
      description(formData)
    ) : (
      <p>{description}</p>
    );
  };

  toggleAllButtons = event => {
    if (event) {
      event.preventDefault();
    }

    const open = this.state.collapseAll ? 'true' : 'false';
    this.togglingAll = true;
    const scrollPosition = window.scrollY;
    document
      .querySelectorAll(`va-accordion-item[open="${open}"]`)
      .forEach(item => item.shadowRoot.querySelector('button').click());
    window.scrollTo(0, scrollPosition);
    this.togglingAll = false;
    this.setState({ collapseAll: !this.state.collapseAll });
  };

  manuallyToggleCollapseLinkOnClick = event => {
    const clickTarget = event.target.tagName.toLowerCase();
    if (this.togglingAll || clickTarget !== 'va-accordion-item') {
      return;
    }

    // event.target.open will be false if an open accordion has just
    // been closed.
    const closing = event.target.open;
    const open = !closing ? 'true' : 'false';
    const matchedAccordions = document.querySelectorAll(
      `va-accordion-item[open="${open}"]`,
    );

    // If there are no accordions that apply to the current state, swap
    // the Collapse All/Expand All state.
    if (!matchedAccordions.length && this.state.collapseAll !== closing) {
      this.setState({ collapseAll: !this.state.collapseAll });
    }
  };

  isRequired = name => {
    const { schema } = this.props;
    const schemaRequired =
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  };

  render() {
    const dataType = this.props.schema.type;
    if (dataType !== 'array') {
      throw new Error(`Data Type ${dataType} not supported.`);
    }

    const { formData } = this.props;
    const items =
      formData && formData.length
        ? formData
        : [
            getDefaultFormState(
              this.props.schema,
              undefined,
              this.props.registry.definitions,
            ),
          ];

    const uiOptions = this.props.uiSchema['ui:options'] || {};
    const ViewField = uiOptions.viewField;

    return (
      <>
        {this.getDescription()}

        <button
          className="accordion-toggle-button"
          onClick={this.toggleAllButtons}
          type="button"
        >
          {this.state.collapseAll ? 'Collapse All' : 'Expand All'}
        </button>

        <va-accordion bordered>
          {items.map(item => {
            const subheader = `${moment(item.dateRange.from).format(
              FORMAT_DATE_READABLE,
            )} – ${moment(item.dateRange.to).format(FORMAT_DATE_READABLE)}`;

            return (
              <va-accordion-item
                header={item.serviceBranch}
                key={item.path}
                open="false"
                subheader={subheader}
              >
                <ViewField formData={item} />
              </va-accordion-item>
            );
          })}
        </va-accordion>
      </>
    );
  }
}

AccordionField.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      /**
       * ReactNode that should be shown instead of edit fields It's passed the
       * same formData the field is
       */
      viewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.elementType,
      ]).isRequired,
    }).isRequired,
    'ui:description': PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.elementType,
      PropTypes.string,
    ]),
    'ui:title': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    'ui:subtitle': PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    saveClickTrackEvent: PropTypes.object,
  }).isRequired,
  schema: PropTypes.object.isRequired,
  errorSchema: PropTypes.object.isRequired,
  idSchema: PropTypes.object.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.elementType.isRequired,
    }),
    definitions: PropTypes.object.isRequired,
  }).isRequired,
  formData: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};

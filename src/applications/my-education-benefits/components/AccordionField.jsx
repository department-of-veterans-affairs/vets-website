import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
  getDefaultFormState,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import get from 'platform/utilities/data/get';
import { isReactComponent } from 'platform/utilities/ui';
import { formatReadableDate } from '../helpers';

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

  MEB_ACORDION_ITEM = 'va-accordion-item';

  accordionField;

  accordionFieldItems;

  constructor(props) {
    super(props);
    this.id = _.uniqueId('meb-accordion-field-');

    // Throw an error if there’s no viewComponent (should be React component)
    if (
      !isReactComponent(get('ui:options.viewComponent', this.props.uiSchema))
    ) {
      throw new Error(
        `No viewComponent found in uiSchema for AccordionField${
          this.props.idSchema.$id
        }.`,
      );
    }

    this.state = {
      collapseAll: false,
    };
  }

  componentDidMount() {
    this.accordionField = document.getElementById(this.id);
    if (!this.accordionField) {
      return;
    }

    const accordionItemNodes = this.accordionField.querySelectorAll(
      this.MEB_ACORDION_ITEM,
    );
    this.accordionFieldItems = Array.from(accordionItemNodes);

    if (this.accordionFieldItems.length) {
      this.accordionFieldItems.forEach(item =>
        item.addEventListener('click', this.manuallyToggleCollapseLinkOnClick),
      );
    }
  }

  componentWillUnmount() {
    if (this.accordionFieldItems && this.accordionFieldItems.length) {
      this.accordionFieldItems.forEach(item =>
        item.removeEventListener(
          'click',
          this.manuallyToggleCollapseLinkOnClick,
        ),
      );
    }
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

  // toggleAllButtons = event => {
  //   if (event) {
  //     event.preventDefault();
  //   }

  //   if (!this.accordionFieldItems || !this.accordionFieldItems.length) {
  //     return;
  //   }

  //   // Set togglingAll to true while we're toggleing the accordions so
  //   // manuallyToggleCollapseLinkOnClick doesn't also check if the
  //   // Collapse/Expand all link should be toggled, as we would when the
  //   // veteran manually collapses or expands the accordions.
  //   this.togglingAll = true;
  //   // Preserve the scroll position as it will otherwise change when
  //   // the accordions are expanded.
  //   const scrollPosition = window.scrollY;
  //   this.accordionFieldItems
  //     .filter(item => item.open === this.state.collapseAll)
  //     .forEach(item => item.shadowRoot.querySelector('button').click());
  //   window.scrollTo(0, scrollPosition);
  //   this.togglingAll = false;
  //   this.setState({ collapseAll: !this.state.collapseAll });
  // };

  manuallyToggleCollapseLinkOnClick = event => {
    const clickTarget = event.target.tagName.toLowerCase();
    if (this.togglingAll || clickTarget !== this.MEB_ACORDION_ITEM) {
      return;
    }

    // event.target.open will be false if an open accordion has just
    // been closed.
    const closing = event.target.open;
    const matchedAccordions = this.accordionFieldItems.filter(
      item => item.open === !closing,
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

    const { formData, formContext } = this.props;

    if (!formData || !formData.length) {
      return <p>No service history was found.</p>;
    }

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
    let vaAccordionItemKeyId = 0;

    if (formContext?.onReviewPage) {
      return (
        <>
          {items.map(item => {
            return (
              <ViewField
                // eslint-disable-next-line no-plusplus
                key={`${this.id}-${vaAccordionItemKeyId++}`}
                formData={item}
              />
            );
          })}
        </>
      );
    }
    return (
      <>
        {this.getDescription()}

        {/* {!formContext?.onReviewPage && (
          <button
            className="accordion-toggle-button"
            onClick={this.toggleAllButtons}
            type="button"
          >
            {this.state.collapseAll ? 'Collapse all' : 'Expand all'}
          </button>
        )} */}

        <va-accordion bordered id={this.id}>
          {items.map(item => {
            const subheader = item.dateRange
              ? `${formatReadableDate(
                  item.dateRange.from,
                  2,
                )} – ${formatReadableDate(item.dateRange.to, 2)}`
              : '';

            return (
              <va-accordion-item
                header={item.serviceBranch}
                // eslint-disable-next-line no-plusplus
                key={`${this.id}-${vaAccordionItemKeyId++}`}
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
    'ui:title': PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.string,
    ]),
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
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onBlur: PropTypes.func.isRequired,
  formContext: PropTypes.shape({
    onError: PropTypes.func.isRequired,
  }).isRequired,
};

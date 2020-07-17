import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';

import ProgressButton from '../components/ProgressButton';
import SchemaForm from '../components/SchemaForm';
import { setData, uploadFile } from '../actions';
import { getNextPagePath, getPreviousPagePath } from '../routing';
import { focusElement } from '../utilities/ui';

function focusForm() {
  focusElement('.nav-header');
}

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.Forms?.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

class FormPage extends React.Component {
  componentDidMount() {
    if (!this.props.blockScrollOnMount) {
      scrollToTop();
      focusForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.route.pageConfig.pageKey !==
        this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)
    ) {
      scrollToTop();
      focusForm();
    }
  }

  onChange = formData => {
    const { pageConfig } = this.props.route;
    let newData = formData;
    if (pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = _.set(
        [this.props.route.pageConfig.arrayPath, this.props.params.index],
        formData,
        this.props.form.data,
      );
    }
    if (typeof pageConfig.updateFormData === 'function') {
      newData = pageConfig.updateFormData(this.formData(), newData);
    }
    this.props.setData(newData);
  };

  onSubmit = ({ formData }) => {
    const { form, params, route, location } = this.props;

    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    if (route.pageConfig.showPagePerItem) {
      const newData = _.set(
        [route.pageConfig.arrayPath, params.index],
        formData,
        form.data,
      );
      this.props.setData(newData);
    }

    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    this.props.router.push(path);
  };

  formData = () => {
    const { pageConfig } = this.props.route;
    return this.props.route.pageConfig.showPagePerItem
      ? _.get(
          [pageConfig.arrayPath, this.props.params.index],
          this.props.form.data,
        )
      : this.props.form.data;
  };

  goBack = () => {
    const {
      form,
      route: { pageList },
      location,
    } = this.props;
    const path = getPreviousPagePath(pageList, form.data, location.pathname);

    this.props.router.push(path);
  };

  render() {
    const {
      route,
      params,
      form,
      contentAfterButtons,
      formContext,
      appStateData,
    } = this.props;

    let { schema, uiSchema } = form.pages[route.pageConfig.pageKey];

    const pageClasses = classNames('form-panel', route.pageConfig.pageClass);
    const data = this.formData();

    if (route.pageConfig.showPagePerItem) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      schema =
        schema.properties[route.pageConfig.arrayPath].items[params.index];
      // Similarly, the items uiSchema and the data for just that particular item are passed
      uiSchema = uiSchema[route.pageConfig.arrayPath].items;
    }
    // It should be "safe" to check that this is the first page because it is
    // always eligible and enabled, no need to call getPreviousPagePath.
    const isFirstRoutePage =
      route.pageList[0].path === this.props.location.pathname;

    function callOnContinue() {
      if (typeof route.pageConfig.onContinue === 'function') {
        route.pageConfig.onContinue(data);
      }
    }

    return (
      <div className={pageClasses}>
        <SchemaForm
          name={route.pageConfig.pageKey}
          title={route.pageConfig.title}
          data={data}
          appStateData={appStateData}
          schema={schema}
          uiSchema={uiSchema}
          pagePerItemIndex={params ? params.index : undefined}
          formContext={formContext}
          trackingPrefix={this.props.form.trackingPrefix}
          uploadFile={this.props.uploadFile}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
        >
          <div className="row form-progress-buttons schemaform-buttons">
            <div className="small-6 medium-5 columns">
              {!isFirstRoutePage && (
                <ProgressButton
                  onButtonClick={this.goBack}
                  buttonText="Back"
                  buttonClass="usa-button-secondary"
                  beforeText="«"
                />
              )}
            </div>
            <div className="small-6 medium-5 end columns">
              <ProgressButton
                submitButton
                onButtonClick={callOnContinue}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"
              />
            </div>
          </div>
          {contentAfterButtons}
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { appStateSelector } = ownProps.route.pageConfig;
  return {
    form: state.form,
    user: state.user,
    appStateData: appStateSelector && appStateSelector(state),
  };
}

const mapDispatchToProps = {
  setData,
  uploadFile,
};

FormPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired,
      onContinue: PropTypes.func,
    }),
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      }),
    ),
  }),
  contentAfterButtons: PropTypes.element,
  setData: PropTypes.func,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(FormPage),
);

export { FormPage };

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import classNames from 'classnames';

import SubmitController from './SubmitController';

import DowntimeNotification, { externalServiceStatus } from '../../../../platform/monitoring/DowntimeNotification';
import DowntimeMessage from '../../../../platform/forms/save-in-progress/RoutedSavableReviewPage.jsx';

import SchemaForm from 'us-forms-system/lib/js/components/SchemaForm';
import { setData, uploadFile } from 'us-forms-system/lib/js/actions';
import { getNextPagePath, getPreviousPagePath } from 'us-forms-system/lib/js/routing';
import { focusElement } from 'us-forms-system/lib/js/utilities/ui';

function focusForm() {
  focusElement('.nav-header');
}

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.Forms.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class FormPage extends React.Component {
  componentDidMount() {
    if (!this.props.blockScrollOnMount) {
      scrollToTop();
      focusForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.pageConfig.pageKey !== this.props.route.pageConfig.pageKey ||
      _.get('params.index', prevProps) !== _.get('params.index', this.props)) {
      scrollToTop();
      focusForm();
    }
  }

  onChange = (formData) => {
    let newData = formData;
    if (this.props.route.pageConfig.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = _.set([this.props.route.pageConfig.arrayPath, this.props.params.index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  onSubmit = ({ formData }) => {
    debugger;
    const { form, params, route, location } = this.props;

    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    if (route.pageConfig.showPagePerItem) {
      const newData = _.set([route.pageConfig.arrayPath, params.index], formData, form.data);
      this.props.setData(newData);
    }

    const path = getNextPagePath(route.pageList, form.data, location.pathname);

    this.props.router.push(path);
  }

  goBack = () => {
    const { form, route: { pageList }, location } = this.props;
    const path = getPreviousPagePath(pageList, form.data, location.pathname);

    this.props.router.push(path);
  }

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.formConfig.downtime.message || DowntimeMessage;

      return (
        <Message downtime={downtime}/>
      );
    }

    return children;
  }

  render() {
    const {
      route,
      params, // add to proptypes
      form,
      formContext, // add to proptypes
      contentAfterButtons,
      path // add to proptypes
    } = this.props;

    const { formConfig } = route; // add to proptypes
    let {
      schema,
      uiSchema
    } = form.pages[route.pageConfig.pageKey];

    const downtimeDependencies = _.get('downtime.dependencies', formConfig) || [];

    const pageClasses = classNames('form-panel', route.pageConfig.pageClass);
    let data = form.data;

    if (route.pageConfig.showPagePerItem) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      schema = schema.properties[route.pageConfig.arrayPath].items[params.index];
      // Similarly, the items uiSchema and the data for just that particular item are passed
      uiSchema = uiSchema[route.pageConfig.arrayPath].items;
      // And the data should be for just the item in the array
      data = _.get([route.pageConfig.arrayPath, params.index], data);
    }

    return (
      <div className={pageClasses}>
        <SchemaForm
          name={route.pageConfig.pageKey}
          title={route.pageConfig.title}
          data={data}
          schema={schema}
          uiSchema={uiSchema}
          pagePerItemIndex={params ? params.index : undefined}
          formContext={formContext}
          uploadFile={this.props.uploadFile}
          onChange={this.onChange}
          onSubmit={this.onSubmit}>
          <DowntimeNotification
            appTitle="application"
            render={this.renderDowntime}
            dependencies={downtimeDependencies}>
            <SubmitController
              formConfig={formConfig}
              pageList={route.pageList}
              path={path}
              renderErrorMessage={this.renderErrorMessage}/>
          </DowntimeNotification>
          {contentAfterButtons}
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    user: state.user
  };
}

const mapDispatchToProps = {
  setData,
  uploadFile
};

FormPage.propTypes = {
  form: PropTypes.object.isRequired,
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      pageKey: PropTypes.string.isRequired,
      schema: PropTypes.object.isRequired,
      uiSchema: PropTypes.object.isRequired
    }),
    pageList: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired
    }))
  }),
  contentAfterButtons: PropTypes.element,
  setData: PropTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormPage));

export { FormPage };

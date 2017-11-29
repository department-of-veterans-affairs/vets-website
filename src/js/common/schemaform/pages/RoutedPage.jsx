import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import FormPage from '../FormPage';
import ProgressButton from '../../components/form-elements/ProgressButton';
import { setData, uploadFile } from '../actions';
import { getNextPage, getPreviousPage } from '../routing';

class RoutedPage extends React.Component {
  onSubmit(formData) {
    this.props.setData(formData);

    const { form, route: { pageConfig, pageList }, location } = this.props;
    const page = getNextPage(pageList, form.data, location.pathname, pageConfig);

    this.props.router.push(page);
  }

  goBack = () => {
    const { form, route: { pageConfig, pageList }, location } = this.props;
    const page = getPreviousPage(pageList, form.data, location.pathname, pageConfig);

    this.props.router.push(page);
  }

  render() {
    const {
      route,
      params,
      form,
      contentAfterButtons,
      blockScrollOnMount,
      prefilled
    } = this.props;
    const {
      schema,
      uiSchema
    } = form.pages[route.pageConfig.pageKey];

    return (
      <FormPage
        name={route.pageConfig.pageKey}
        title={route.pageConfig.title}
        data={form.data}
        schema={schema}
        uiSchema={uiSchema}
        itemIndex={params ? params.index : undefined}
        blockScrollOnMount={blockScrollOnMount}
        prefilled={prefilled}
        uploadFile={this.props.uploadFile}
        onChange={this.props.setData}
        onSubmit={this.onSubmit}>
        <div className="row form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
              onButtonClick={this.goBack}
              buttonText="Back"
              buttonClass="usa-button-secondary"
              beforeText="«"/>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
              submitButton
              buttonText="Continue"
              buttonClass="usa-button-primary"
              afterText="»"/>
          </div>
        </div>
        {contentAfterButtons}
      </FormPage>
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

RoutedPage.propTypes = {
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
  setData: PropTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutedPage));

export { RoutedPage };

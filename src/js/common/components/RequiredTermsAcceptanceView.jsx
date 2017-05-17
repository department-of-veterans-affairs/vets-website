import PropTypes from 'prop-types';
import React from 'react';

import AcceptTermsPrompt from './authentication/AcceptTermsPrompt';
import LoadingIndicator from '../../common/components/LoadingIndicator';

class RequiredTermsAcceptanceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    fetchTerms(this.props.termsName);
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  render() {
    let view;

    const acceptTermsComponent = <AcceptTermsPrompt/>;

    if (this.state.loading === true) {
      view = <LoadingIndicator setFocus message="Loading your information"/>;
    } else {
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

RequiredLoginView.propTypes = {
  termsName: PropTypes.string.isRequired
};

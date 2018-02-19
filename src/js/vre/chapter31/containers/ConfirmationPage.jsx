import React from 'react';
import { connect } from 'react-redux';

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
  }

  toggleExpanded = (e) => {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };

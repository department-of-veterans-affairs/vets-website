import React from 'react';
import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs';

class Main extends React.Component {
  render() {
    return (
      <div>
        <Breadcrumbs location={this.props.location}/>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

import React from 'react';
import * as HelloWorldApi from '../api/HelloWorldApi';

export class HelloWorld extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: this.props.form,
      status: this.props.status,
    };
    this.handleChangeFor = this.handleChangeFor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const resp = await HelloWorldApi.getMessage2();
      await this.setState({ status: resp.status });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error');
    }
  }

  handleChangeFor = field => event => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    return (
      <div>
        <div className="message">Hello World</div>
        <form className="testForm" onSubmit={this.handleSubmit}>
          <h1>Hello World Form</h1>
          <label>
            TestEntry:
            <input
              type="text"
              className="test"
              onChange={this.handleChangeFor('form.firstField')}
            />
          </label>
          <input
            className="button"
            type="submit"
            value="Submit"
            onClick={this.handleSubmit}
          />
        </form>
      </div>
    );
  }
}

export default HelloWorld;

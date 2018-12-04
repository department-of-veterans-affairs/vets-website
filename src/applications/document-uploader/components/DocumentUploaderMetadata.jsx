import React from 'react';

export class DocumentUploaderMetadata extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildFiles = this.buildFiles.bind(this);
  }

  buildFiles(event, main) {
    const files = Array.from(event.target.files);
    if (main) {
      const supporting = this.props.files;
      supporting.shift();
      return [...files, ...supporting];
    }
    return [this.props.files[0], ...files];
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'comments':
        this.props.setComments(event.target.value);
        break;
      case 'mainFile':
        this.props.setFiles(this.buildFiles(event, true));
        break;
      case 'supportingFiles':
        this.props.setFiles(this.buildFiles(event, false));
        break;
      default: {
        const vet = { ...this.props.veteran };
        vet[event.target.name] = event.target.value;
        this.props.setVeteran(vet);
        break;
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.submitFiles(
      this.props.veteran,
      this.props.files,
      this.props.comments,
    );
  }

  handleNumberLength(event) {
    if (event.target.value.length >= 9) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  render() {
    return (
      <div className="usa-grid usa-width-one-whole">
        <form className="usa-htmlForm-large">
          <label htmlFor="veterans-first-name">Veteran's First Name</label>
          <input
            type="text"
            name="firstName"
            id="veterans-first-name"
            value={this.props.veteran.firstName}
            onChange={this.handleChange}
          />

          <label htmlFor="veterans-last-name">Veteran's Last Name</label>
          <input
            type="text"
            name="lastName"
            id="veterans-last-name"
            value={this.props.veteran.lastName}
            onChange={this.handleChange}
          />

          <label htmlFor="email-address">Email Address</label>
          <input
            type="email"
            name="email"
            id="email-address"
            value={this.props.veteran.email}
            onChange={this.handleChange}
          />

          <label htmlFor="fileNumber">
            File Number or SSN (no hyphens or spaces)
          </label>
          <input
            type="number"
            name="fileNumber"
            id="veterans-file-number"
            value={this.props.veteran.fileNumber}
            onKeyPress={this.handleNumberLength}
            onChange={this.handleChange}
          />

          <label htmlFor="mainFile">Main File</label>
          <input
            type="file"
            name="mainFile"
            id="files"
            onChange={this.handleChange}
            required
            multiple
          />

          <label htmlFor="supportFiles">Supporting Files</label>
          <input
            type="file"
            name="supportingFiles"
            id="files"
            onChange={this.handleChange}
            required
            multiple
          />

          <label htmlFor="comments">Comments</label>
          <textarea
            name="comments"
            id="comments"
            value={this.props.comments}
            onChange={this.handleChange}
            rows="8"
            cols="40"
          />

          <input
            type="submit"
            name="submit"
            id="submit"
            disabled={this.props.status !== 'ready'}
            onClick={this.handleSubmit}
            value="Upload files to VA"
          />
        </form>
      </div>
    );
  }
}

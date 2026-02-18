import { expect } from 'chai';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import backgroundInformationDetailsPageSchema from '../../../../pages/helpers/backgroundInformationDetailsPageSchema';

describe('backgroundInformationDetailsPageSchema (multi-file upload)', () => {
  const title = 'Conviction details';
  const path = 'conviction-details';
  const question =
    'Provide the date, a detailed explanation, and the location of the conviction as well as the name and address of the military authority or court involved.';

  const depends = () => true;
  const explanationDescription = () => null;

  const explanationKey = 'convictionDetailsExplanation';
  const documentsKey = 'convictionDetailsDocuments';
  const certificationKey = 'convictionDetailsCertification';

  const build = (overrides = {}) =>
    backgroundInformationDetailsPageSchema({
      title,
      path,
      question,
      depends,
      explanationDescription,
      ...overrides,
    });

  it('returns an object with title, path, depends, uiSchema, and schema', () => {
    const page = build();
    expect(page.title).to.equal(title);
    expect(page.path).to.equal(path);
    expect(page.depends).to.equal(depends);
    expect(page.uiSchema).to.be.an('object');
    expect(page.schema).to.be.an('object');
  });

  it('uses camelCased field keys for explanation, documents, and certification', () => {
    const { uiSchema, schema } = build();
    expect(uiSchema).to.have.property(explanationKey);
    expect(uiSchema).to.have.property(documentsKey);
    expect(uiSchema).to.have.property(certificationKey);
    expect(schema.properties).to.have.property(explanationKey);
    expect(schema.properties).to.have.property(documentsKey);
    expect(schema.properties).to.have.property(certificationKey);
  });

  it('configures the multi-file upload with correct options and URL', () => {
    const { uiSchema, schema } = build();
    const opts = uiSchema[documentsKey]['ui:options'];

    expect(opts).to.be.an('object');
    expect(opts.maxFileSize).to.equal(26214400);
    expect(opts.accept).to.equal('.pdf,.docx');
    expect(opts.name).to.equal(`${path}-file-input`);

    const expectedPrefix = `${
      environment.API_URL
    }/accredited_representative_portal/v0/form21a/`;
    expect(opts.fileUploadUrl).to.equal(`${expectedPrefix}${path}`);
    expect(opts.fileUploadUrl.startsWith(environment.API_URL)).to.be.true;
    expect(opts.fileUploadUrl.endsWith(`/${path}`)).to.be.true;

    const props = schema.properties[documentsKey].items.properties;
    expect(props).to.have.all.keys(
      'additionalData',
      'confirmationCode',
      'name',
      'size',
      'type',
      'warnings',
    );
  });

  it('requires explanation and certification, but not documents', () => {
    const { schema } = build();
    expect(schema.required).to.include(explanationKey);
    expect(schema.required).to.include(certificationKey);
    expect(schema.required).to.not.include(documentsKey);
  });

  it('sets the explanation description component', () => {
    const { uiSchema } = build();
    expect(uiSchema[explanationKey]['ui:description']).to.exist;
  });

  it('respects dynamic path values when building the upload URL and keys', () => {
    const altPath = 'reprimanded-in-agency-details';
    const camel = 'reprimandedInAgencyDetails';
    const page = build({ path: altPath });

    expect(page.uiSchema).to.have.property(`${camel}Documents`);
    const url = page.uiSchema[`${camel}Documents`]['ui:options'].fileUploadUrl;

    const expectedPrefix = `${
      environment.API_URL
    }/accredited_representative_portal/v0/form21a/`;
    expect(url).to.equal(`${expectedPrefix}${altPath}`);
  });

  it('renders without “warnings” BasicArrayField override (handled by multi-upload internally)', () => {
    const { uiSchema } = build();
    expect(uiSchema[documentsKey].warnings).to.be.undefined;
  });
});

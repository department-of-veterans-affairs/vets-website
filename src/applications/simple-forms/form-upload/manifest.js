import { buildManifest } from './manifest-helpers';

const formUploadForms = ['21-0779', '21-509'];

const manifest = formUploadForms.map(formNumber => buildManifest(formNumber));

module.exports = manifest;

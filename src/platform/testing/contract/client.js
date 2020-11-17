/* eslint-disable no-console */

const base64 = require('base-64');
const fs = require('fs');
const path = require('path');

require('isomorphic-fetch');

/**
 * typedef {Object} PactObject
 * @property {Object} data - The object parsed from the pact JSON file.
 * @property {string} version - The version to apply to the pact.
 * @property {string} tag - A tag for the consumer on this version.
 */

/**
 * Client that interacts with a Pact Broker.
 */
module.exports = class PactBrokerClient {
  /**
   * Instantiates the client.
   * @param {string} url - Location of the Pact Broker.
   * @param {string} [username] - Basic auth username.
   * @param {string} [password] - Basic auth password.
   */
  constructor({ url, username, password }) {
    try {
      if (!url) throw new Error('PactBrokerClient: url is required');
      this.url = new URL(url).toString();
      this.authHeaders =
        username && password
          ? {
              Authorization: `Basic ${base64.encode(
                `${username}:${password}`,
              )}`,
            }
          : null;
    } catch (e) {
      console.error('PactBrokerClient failed to initialize.');
      throw e;
    }
  }

  /**
   * Gets the object representations of all pacts that have been generated.
   * @param {string} pactDir - The directory where pacts have been generated.
   * @return {Object[]} An array of all generated pacts parsed into objects.
   */
  parsePacts = pactDir => {
    const pactFiles = fs.readdirSync(pactDir);
    if (!pactFiles.length) throw new Error('No pacts found.');
    return pactFiles.map(pactFile =>
      JSON.parse(fs.readFileSync(path.join(pactDir, pactFile))),
    );
  };

  /**
   * Publishes a pact.
   * @params {PactObject} pactObject
   */
  publishPact = async pactObject => {
    const { data, version } = pactObject;
    const consumer = data.consumer.name;
    const provider = data.provider.name;

    const url = new URL(
      path.join(
        this.url,
        'pacts',
        `provider/${provider}`,
        `consumer/${consumer}`,
        `version/${version}`,
      ),
    ).toString();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(
        `Published pact between consumer ${consumer} and provider ${provider}.`,
      );
    } else {
      throw new Error(
        `Failed to publish pact between consumer ${consumer} and provider ${provider}: ${
          response.status
        } ${response.statusText}`,
      );
    }

    return pactObject;
  };

  /**
   * Tags a pact.
   * @params {PactObject} pactObject
   */
  tagPact = async pactObject => {
    const { data, version, tag } = pactObject;
    const consumer = data.consumer.name;

    const url = new URL(
      path.join(
        this.url,
        'pacticipants',
        consumer,
        `versions/${version}`,
        `tags/${tag}`,
      ),
    ).toString();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`Tagged version ${version} of ${consumer} as "${tag}".`);
    } else {
      throw new Error(
        `Failed to tag version ${version} of consumer ${consumer} as "${tag}": ${
          response.status
        } ${response.statusText}`,
      );
    }

    return pactObject;
  };

  /**
   * Publishes and tags a pact.
   * @param {PactObject} pactObject
   */
  publishAndTagPact = pactObject =>
    Promise.resolve(pactObject)
      .then(this.publishPact)
      .then(this.tagPact);

  /**
   * Publishes and tags all pacts in the pacts folder.
   * @param {Object} options
   * @param {string} options.pactDir - The directory of pacts to be published.
   * @param {string} options.version - The version to apply to the pacts.
   * @param {string} options.tag - A tag for the consumers on this version.
   */
  publishAndTagPacts = async options => {
    const requiredOptions = ['pactDir', 'version', 'tag'];

    try {
      requiredOptions.forEach(key => {
        if (!options[key])
          throw new Error(`publishAndTagPacts: ${key} is required`);
      });

      const { pactDir, version, tag } = options;

      const pactObjects = this.parsePacts(pactDir).map(data => ({
        data,
        version,
        tag,
      }));

      await Promise.all(pactObjects.map(this.publishAndTagPact));
      console.log('Successfully published and tagged pacts.');
    } catch (e) {
      console.error('Failed to publish and tag pacts.');
      throw e;
    }
  };
};

/* eslint-disable no-console */

const base64 = require('base-64');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

/**
 * typedef {Object} PactObject
 * @property {Object} data - The object parsed from the pact JSON file.
 * @property {string} version - The version to apply to the pact.
 * @property {string} tag - A tag for the consumer on this version.
 */

/**
 * typedef {Object} BrokerOperationOptions
 * @param {string} pactDir - The directory of pacts to be published.
 * @param {string} version - The version to apply to the pacts.
 * @param {string} tag - A tag for the consumers on this version.
 */

/**
 * typedef {Object} VerificationContext
 * @param {string} consumer - The consumer name.
 * @param {string} version - The consumer version.
 * @param {string} tag - The environment to deploy the consumer.
 * @param {string} url - The endpoint to invoke for can-i-deploy.
 */

/**
 * Validates that required properties are defined in an options object.
 * @param {string} context - The name of the relevant function or class.
 * @param {string[]} required - The required options.
 * @param {Object} options - The options to be validated.
 */
const validateRequiredOptions = (context, required, options) => {
  required.forEach(key => {
    if (!options[key]) throw new Error(`${context}: ${key} is required`);
  });
};

/**
 * Generates a basic auth header based on username and password.
 * @param {string} username
 * @param {string} password
 * @return {Object} The auth header.
 */
const generateBasicAuthHeader = (username, password) => ({
  Authorization: `Basic ${base64.encode(`${username}:${password}`)}`,
});

/**
 * Validates and escapes a string URL and returns it as a string.
 * @param {string} url - String to be validated as URL.
 * @return {string} URL that's been validated and cast to string.
 */
const urlString = url => new URL(encodeURI(url)).toString();

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
      validateRequiredOptions('PactBrokerClient', ['url'], { url });
      this.url = urlString(url);
      this.authHeader =
        username && password
          ? generateBasicAuthHeader(username, password)
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

    const url = urlString(
      path.join(
        this.url,
        'pacts',
        `provider/${encodeURIComponent(provider)}`,
        `consumer/${encodeURIComponent(consumer)}`,
        `version/${version}`,
      ),
    );

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeader,
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

    const url = urlString(
      path.join(
        this.url,
        `pacticipants/${encodeURIComponent(consumer)}`,
        `versions/${version}`,
        `tags/${encodeURIComponent(tag)}`,
      ),
    );

    console.log(url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.authHeader,
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
   * @param {BrokerOperationOptions} options
   */
  publishAndTagPacts = async options => {
    try {
      validateRequiredOptions(
        'publishAndTagPacts',
        ['pactDir', 'version', 'tag'],
        options,
      );

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

  /**
   * Creates a set of objects that provide context for figuring out
   * whether the consumers from the generated pacts have passed
   * verification and can be deployed to the desired environment.
   * @param {BrokerOperationOptions} options
   * @return {VerificationContext[]}
   */
  createVerificationContexts = ({ pactDir, version, tag }) => {
    const baseUrl = new URL(path.join(this.url, 'matrix'));
    // Get latest result for each consumer version and provider (cvp) pairing.
    // In other words, checks if this consumer version has passed verification
    // with all of its providers on the latest versions with the given tag.
    baseUrl.searchParams.append('latestby', 'cvp');
    baseUrl.searchParams.append('latest', true);
    baseUrl.searchParams.append('tag', tag);
    baseUrl.searchParams.append('q[]version', version);

    return this.parsePacts(pactDir).map(data => {
      const consumer = data.consumer.name;
      let url = new URL(baseUrl);
      url.searchParams.append('q[]pacticipant', consumer);
      url = url.toString();
      return { consumer, version, tag, url };
    });
  };

  /**
   * Retrieves the verification status for a consumer, including
   * a summary of whether that consumer can be deployed.
   * @param {VerificationContext}
   * @return {Object} Verification result for the consumer.
   */
  getVerificationStatus = async ({ consumer, version, tag, url }) => {
    const response = await fetch(url, { headers: this.authHeader });

    if (!response.ok) {
      throw new Error(
        `Failed to get verification status for ${consumer}: ${
          response.status
        } ${response.statusText}`,
      );
    }

    const results = await response.json();
    const { deployable, reason } = results.summary;

    console.log(
      `${
        deployable ? 'Can' : "Can't"
      } deploy ${consumer} on version ${version} to ${tag}.`,
    );

    console.log(reason);

    return results;
  };

  /**
   * Checks whether all consumers from the generated pacts can be deployed
   * to the desired environment. Returns the aggregate deployable status
   * along with the verification results for each consumer.
   * @param {BrokerOperationOptions}
   * @return {Object} Verification results and aggregate deployability status.
   */
  canDeploy = async options => {
    let verificationResults;

    try {
      validateRequiredOptions(
        'canDeploy',
        ['pactDir', 'version', 'tag'],
        options,
      );

      const verificationContexts = this.createVerificationContexts(options);

      verificationResults = await Promise.all(
        verificationContexts.map(this.getVerificationStatus),
      );
    } catch (e) {
      console.error('Failed to check verification status.');
      throw e;
    }

    return {
      verificationResults,
      canDeploy: verificationResults.every(result => result.summary.deployable),
    };
  };
};

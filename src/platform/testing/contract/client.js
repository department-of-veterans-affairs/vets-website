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
 * typedef {Object} BrokerOperationOptions
 * @param {string} pactDir - The directory of pacts to be published.
 * @param {string} version - The version to apply to the pacts.
 * @param {string} tag - A tag for the consumers on this version.
 */

/**
 * typedef {Object} ConsumerDeployContext
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
      this.url = new URL(url).toString();
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
   * whether the consumers from the generated pacts can be deployed
   * to the desired environment.
   * @param {BrokerOperationOptions} options
   * @return {ConsumerDeployContext[]}
   */
  createConsumerContexts = ({ pactDir, version, tag }) => {
    const baseUrl = new URL(path.join(this.url, 'matrix'));
    // Get latest result for each consumer version and provider (cvp) pairing.
    // In other words, checks if the consumer has passed verification with all
    // of its providers on the latest provider versions with the given tag.
    baseUrl.searchParams.append('latestby', 'cvp');
    baseUrl.searchParams.append('latest', true);
    baseUrl.searchParams.append('tag', tag);
    baseUrl.searchParams.append('q[]version', version);

    return this.parsePacts(pactDir).map(data => {
      const consumer = data.consumer.name;
      const consumerUrl = new URL(baseUrl);
      consumerUrl.searchParams.append('q[]pacticipant', consumer);
      const url = consumerUrl.toString();
      return { consumer, version, tag, url };
    });
  };

  /**
   * Determines whether a consumer is deployable.
   * @param {ConsumerDeployContext}
   * @return {boolean}
   */
  isConsumerDeployable = async ({ consumer, version, tag, url }) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to get deployable status for ${consumer}: ${response.status} ${
          response.statusText
        }`,
      );
    }

    const { deployable, reason } = (await response.json()).summary;
    console.log(
      `${
        deployable ? 'Can' : "Can't"
      } deploy ${consumer} on version ${version} to ${tag}.`,
    );
    console.log(reason);
    return deployable;
  };

  /**
   * Checks whether all consumers from the generated pacts can be deployed
   * to the desired environment. Throws an error if the check fails.
   * @param {BrokerOperationOptions}
   */
  canDeploy = async options => {
    let results;

    try {
      validateRequiredOptions(
        'canDeploy',
        ['pactDir', 'version', 'tag'],
        options,
      );
      const consumerContexts = this.createConsumerContexts(options);
      results = await Promise.all(
        consumerContexts.map(this.isConsumerDeployable),
      );
    } catch (e) {
      console.error('Failed to check deployability.');
      throw e;
    }

    const deployable = results.reduce((arr, cur) => arr && cur);

    if (!deployable) {
      throw new Error(
        "Can't deploy. Try again after providers have successfully verified pacts for the consumers that couldn't deploy.",
      );
    }
  };
};

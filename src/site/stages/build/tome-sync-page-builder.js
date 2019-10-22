const fs = require('fs');
const path = require('path');

/**
 * This assumes the tome-sync output is sibling to the vets-website
 * directory.
 */
const contentDir = path.join(
  __dirname,
  '../../../../../tome-sync-output/content/',
);

/**
 * When reading through entity properties, ignore these.
 */
const blackList = new Set([
  'type',
  'revision_uid',
  'revision_user',
  'user_id',
  'items',
  'owner_id',
  'parent',
  'role_id',
  'roles',
  'uid',
  'vid',
  'access_scheme',
  'bundle',
  // Temporarily ignore the following properties because they were
  // causing circular references. Once we get reader functions based
  // on individual node / entity types, we can remove these from here.
  // See the jsdoc on getEntityProperties for more information.
  'field_facility_location',
  'field_regional_health_service',
  'field_region_page',
  'field_office',
]);

/**
 * Use to consistently reference to an entity.
 *
 * @param {String} type - The type of entity; corresponds to the file
 *                        name.
 * @param {String} uui  - The uuid of the entity; corresponds to the
 *                        file name.
 */
const id = (type, uuid) => `${type}.${uuid}`;

/**
 * Take the entityName, return the contents of the file.
 *
 * Later, we can keep a counter for how many times we open a
 * particular file to see if we can gain anything from caching the
 * contents.
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {String} uuid - The UUID of the entity; corresponds to the
 *                        name of the file.
 */
const fetchEntity = (type, uuid) =>
  JSON.parse(
    fs
      .readFileSync(path.join(contentDir, `${type}.${uuid}.json`))
      .toString('utf8'),
  );

/**
 * Takes the type of entity and entity itself, returns an array of
 * properties that we want to keep for this entity.
 *
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {Object} entity - The contents of the entity itself before
 *                          reference expansion.
 *
 * @return {Array<String>} - A list of properties of the entity to
 *                           keep.
 */
const getEntityProperties = (entityType, entity) =>
  // TODO: Change this to check the entity type and subtype and return
  // a customized list.
  Object.keys(entity);

/**
 * Takes an entity type and uuid, reads the corresponding file,
 * searches for references to other entities, and replaces the
 * references with the contents of those entities recursively.
 *
 * @param {String} entityType - The type of entity; corresponds to the
 *                              name of the file.
 * @param {String} uuid - The UUID of the entity; corresponds to the
 *                        name of the file.
 * @param {Array<String>} parents - A list of parent entities; used to
 *                                  avoid circular references.
 *
 * @return {Object} - The entity with all the references filled in with
 *                    the body of the referenced entities.
 */
const assembler = (entityType, uuid, parents = []) => {
  // Avoid circular references
  if (parents.includes(id(entityType, uuid))) {
    /* eslint-disable no-console */
    console.log(`I'm my own grandpa! (${id(entityType, uuid)})`);
    console.log(`  Parents:\n    ${parents.join('\n    ')}`);
    /* eslint-enable no-console */

    // If we find a circular references, it needs to be addressed;
    // just quit
    process.exit(1);
  }

  const entity = fetchEntity(entityType, uuid);

  // TODO: Once we get the list of properties, the object we return
  // should have _only_ those properties.
  const propList = getEntityProperties(entityType, entity);

  // Iterate over all non-blacklisted properties in an entity, look
  // for references to other identities recursively, and replace the
  // reference with the entity contents.
  for (const key of propList) {
    // eslint-disable-next-line no-continue
    if (blackList.has(key)) continue;
    const prop = entity[key];

    // Properties with target_uuids are always arrays from tome-sync
    if (Array.isArray(prop)) {
      prop.forEach((item, index) => {
        const { target_uuid: targetUuid, target_type: targetType } = item;

        // We found a reference! Override it with the expanded entity.
        if (targetUuid && targetType) {
          entity[key][index] = assembler(
            targetType,
            targetUuid,
            parents.concat([id(entityType, uuid)]),
          );
        }
      });
    }
  }

  return entity;
};

/**
 * Get all the starting nodes
 */
const getAllNodes = () =>
  fs
    .readdirSync(contentDir)
    .filter(name => name.startsWith('node'))
    .map(name => name.split('.').slice(0, 2));

const files = getAllNodes().map(([type, uuid]) => assembler(type, uuid));

// eslint-disable-next-line no-console
console.log(files.length);

# (GraphQL response vs. Tome data) by entity

## Entities

[block_content](./block_content.md)

[~~consumer~~ (not used)](./consumer.md)

[crop](./crop.md)

[~~entity_subqueue~~ (not used)](./entity_subqueue.md)

[file](./file.md)

[media](./media.md)

[menu_link_content](./menu_link_content.md)

[node](./node.md)

[paragraph](./paragraph.md)

[~~redirect~~ (not used)](./redirect.md)

[~~section_association~~ (not used)](./section_association.md)

[~~taxonomy_term~~ (not used)](./taxonomy_term.md)

[~~user~~ (not used)](./user.md)

## Terminology

- `Content type` [mentioned in the CMS](https://docs.google.com/spreadsheets/d/1vL8rqLqcEVfESnJJK_GWQ7nf3BPe4SSevYYblisBTOI/edit#gid=943298572) equates to a `node` entity.
- Most key-value pairs on entities that start with `field_` are **matched to a specific `target_id`** and/or are **optional**.

## Assumptions

- Each entity included in the Tome response **always** has the same key-value pairs for that particular entity.
  - This is `invalid`. Many of the entities have various `target_id`s and each `target_id` typically has unique key-value pairs. This is now outlined in each entity's markdown file.

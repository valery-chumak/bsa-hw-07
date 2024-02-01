const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  RENAME: "card:rename",
  CHANGE_DESCRIPTION: "card:change-description",
  DUPLICATE: "card:duplicate",
  DELETE: "card:delete",
} as const;

export { CardEvent };

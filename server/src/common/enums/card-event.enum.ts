const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  DUPLICATE: "card:duplicate",
  DELETE: "card:delete",
  CHANGE_DESCRIPTION: "card:change-description",
  RENAME: "card:rename",
} as const;

export { CardEvent };

export const mergeUnique = (existing: string[], incoming: string[]) => {
  const set = new Set([...existing, ...incoming]);
  return Array.from(set);
};

export const applyDocumentChangeHandler = async (
  setCreatedIds,
  setChangedIds,
  setDeletedIds
) => {
  await figma.loadAllPagesAsync();

  figma.on("documentchange", (event) => {
    const created: string[] = [];
    const changed: string[] = [];
    const deleted: string[] = [];

    for (const change of event.documentChanges) {
      switch (change.type) {
        case "CREATE":
        case "STYLE_CREATE":
          created.push(change.id);
          break;

        case "PROPERTY_CHANGE":
        case "STYLE_PROPERTY_CHANGE":
          changed.push(change.id);
          break;

        case "DELETE":
        case "STYLE_DELETE":
          deleted.push(change.id);
          break;
      }
    }

    setCreatedIds(prev => mergeUnique(prev ?? [], created));
    setChangedIds(prev => mergeUnique(prev ?? [], changed));
    setDeletedIds(prev => mergeUnique(prev ?? [], deleted));
  });
};
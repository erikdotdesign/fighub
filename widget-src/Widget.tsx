import { mergeUnique, getIpData, getCommitTheme, getAffectedPages } from "./helpers";
import { getThemedStyle, ThemedStyle } from "./style";
import NewCommit from "./NewCommit";
import Commit from "./Commit";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState, useWidgetNodeId } = widget;

const Widget = () => {
  const widgetId = useWidgetNodeId();
  const [style, setStyle] = useSyncedState<ThemedStyle>("style", getThemedStyle("light"));
  const [commits, setCommits] = useSyncedState<any>("commits", []);
  const [commitId, setCommitId] = useSyncedState<number>("commitId", 0);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [changedIds, setChangedIds] = useSyncedState<string[]>("changedIds", []);
  const [deletedIds, setDeletedIds] = useSyncedState<string[]>("deletedIds", []);

  const showTrackingUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__, {
          width: 245,
          height: 40,
          themeColors: true
        });
      })
    );
    figma.ui.postMessage({ type: "ui-type", payload: "tracking" });
    hydrateState();
    figma.notify("Tracking changes, closing plugin window (X) will terminate tracking");
  }

  const showCommitUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__, {
          width: 350,
          height: 484,
          themeColors: true
        });
      })
    );
    figma.ui.postMessage({ type: "ui-type", payload: "commit" });
    hydrateState();
  }

  const hydrateState = () => {
    try {
      figma.ui.postMessage({
        type: "hydrate-state",
        payload: {
          commitId,
          createdIds,
          changedIds,
          deletedIds
        }
      });
    } catch {}
  }

  const handleDocumentChange = (event: any) => {
    const created: string[] = [];
    const changed: string[] = [];
    const deleted: string[] = [];

    for (const change of event.documentChanges) {
      // Ignore widget property changes
      if (change.type === "PROPERTY_CHANGE" && change.node?.type === "WIDGET") {
        continue;
      }

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

    if (created.length) {
      setCreatedIds(prev => mergeUnique(prev ?? [], created));
    } else if (changed.length) {
      setChangedIds(prev => mergeUnique(prev ?? [], changed));
    } else if (deleted.length) {
      setDeletedIds(prev => mergeUnique(prev ?? [], deleted));
    }
  }

  const handleUIMessages = (msg: any) => {
    if (msg.type === 'show-tracking-ui') {
      showTrackingUI();
    } else if (msg.type === 'show-commit-ui') {
      showCommitUI();
    } else if (msg.type === 'new-commit') {
      waitForTask(handleNewCommit(msg.payload));
      showTrackingUI();
    } else if (msg.type === 'nothing-to-commit') {
      figma.notify("Nothing to commit");
    }
  }

  const handleNewCommit = async (commitMessage: string) => {
    const ipData = await getIpData();
    const pageData = await getAffectedPages(widgetId, [...createdIds, ...changedIds]);
    const commitDate = Date.now();
    const newCommit = {
      id: commitId,
      date: commitDate,
      theme: getCommitTheme(commitDate),
      user: {
        name: figma.currentUser?.name,
        photo: figma.currentUser?.photoUrl,
        color: figma.currentUser?.color
      },
      location: {
        country: ipData ? ipData.country_name : "Middle-earth",
        region: ipData ? ipData.region : "Mordor",
        postal: ipData ? ipData.postal : "11111"
      },
      message: commitMessage,
      pages: {
        count: Object.keys(pageData.pages).length,
        main: pageData.mainPage
      },
      diff: {
        created: createdIds.length,
        changed: changedIds.length,
        deleted: deletedIds.length
      }
    }
    setCommits([...commits, newCommit]);
    setCommitId(commitId + 1);
    setCreatedIds([]);
    setChangedIds([]);
    setDeletedIds([]);
  }

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await figma.loadAllPagesAsync();
      if (!isMounted) return;
      figma.on("documentchange", handleDocumentChange);
      figma.ui.on("message", handleUIMessages);
    };

    init();
    hydrateState();
    return function cleanup() {
      isMounted = false;
      figma.off("documentchange", handleDocumentChange);
      figma.ui.off("message", handleUIMessages);
    };
  });

  return (
    <AutoLayout
      width="hug-contents"
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={style.spacing.large}>
      {
        commits.map((commit) => (
          <Commit
            key={commit.id}
            style={getThemedStyle(commit.theme)}
            commit={commit} />
        ))
      }
      <NewCommit
        style={style}
        commitId={commitId}
        createdIds={createdIds}
        changedIds={changedIds}
        deletedIds={deletedIds}
        showCommitUI={showCommitUI}
        showTrackingUI={showTrackingUI} />
    </AutoLayout>
  )
};

widget.register(Widget);
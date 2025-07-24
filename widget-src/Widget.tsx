import { Commit } from "./types";
import { mergeUnique, getIpData, getCommitTheme, getAffectedPages } from "./helpers";
import { getThemedStyle, ThemedStyle } from "./style";
import NewCommit from "./NewCommit";
import CommitItem from "./CommitItem";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState, useWidgetNodeId } = widget;

const Widget = () => {
  const widgetId = useWidgetNodeId();
  const [style, setStyle] = useSyncedState<ThemedStyle>("style", getThemedStyle("light"));
  const [commits, setCommits] = useSyncedState<Commit[]>("commits", []);
  const [commitId, setCommitId] = useSyncedState<number>("commitId", 0);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [modifiedIds, setModifiedIds] = useSyncedState<string[]>("modifiedIds", []);
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
    figma.ui.postMessage({ type: "set-ui-type", payload: "tracking" });
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
    figma.ui.postMessage({ type: "set-ui-type", payload: "commit" });
    hydrateState();
  }

  const hydrateState = () => {
    try {
      figma.ui.postMessage({
        type: "hydrate-state",
        payload: {
          commitId,
          createdIds,
          modifiedIds,
          deletedIds
        }
      });
    } catch {}
  }

  const handleDocumentChange = (event: any) => {
    const created: string[] = [];
    const modified: string[] = [];
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
          modified.push(change.id);
          break;

        case "DELETE":
        case "STYLE_DELETE":
          deleted.push(change.id);
          break;
      }
    }

    if (created.length) {
      setCreatedIds(prev => mergeUnique(prev ?? [], created));
    } else if (modified.length) {
      setModifiedIds(prev => mergeUnique(prev ?? [], modified));
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
    } else if (msg.type === 'message-required') {
      figma.notify("Message required");
    }
  }

  const handleNewCommit = async (commitMessage: string) => {
    const ipData = await getIpData();
    const pageData = await getAffectedPages(widgetId, [...createdIds, ...modifiedIds]);
    const commitDate = Date.now();
    const newCommit: Commit = {
      id: commitId,
      timestamp: commitDate,
      theme: getCommitTheme(commitDate),
      user: {
        name: figma.currentUser ? figma.currentUser.name : "User",
        photo: figma.currentUser && figma.currentUser.photoUrl ? figma.currentUser.photoUrl : "https://dummyjson.com/icon/user/72"
      },
      location: {
        country: ipData ? ipData.country_name : "Zarovia",
        region: ipData ? ipData.region : "Solthara",
        postal: ipData ? ipData.postal : "99999"
      },
      message: commitMessage,
      pages: {
        count: Object.keys(pageData.pages).length,
        main: pageData.mainPage
      },
      diff: {
        created: createdIds.length,
        modified: modifiedIds.length,
        deleted: deletedIds.length
      }
    }
    setCommits([...commits, newCommit]);
    setCommitId(commitId + 1);
    setCreatedIds([]);
    setModifiedIds([]);
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
          <CommitItem
            key={commit.id}
            style={getThemedStyle(commit.theme)}
            commit={commit} />
        ))
      }
      <NewCommit
        style={style}
        commitId={commitId}
        createdIds={createdIds}
        modifiedIds={modifiedIds}
        deletedIds={deletedIds}
        showCommitUI={showCommitUI}
        showTrackingUI={showTrackingUI} />
    </AutoLayout>
  )
};

widget.register(Widget);
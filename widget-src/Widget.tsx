import { mergeUnique, getIpData } from "./helpers";
import style from "./style";
import AddCommitButton from "./AddCommitButton";
import InitTrackingButton from "./InitTrackingButton";
import Logo from "./Logo";
import Diff from "./Diff";
import TrackerWarning from "./TrackerWarning";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState } = widget;

const Widget = () => {
  const [commits, setCommits] = useSyncedState<any>("commits", null);
  const [commitId, setCommitId] = useSyncedState<number>("commitId", 0);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [changedIds, setChangedIds] = useSyncedState<string[]>("changedIds", []);
  const [deletedIds, setDeletedIds] = useSyncedState<string[]>("deletedIds", []);
  const [initialized, setInitialized] = useSyncedState<boolean>("initialized", false);

  const showTrackingUI = () => {
    if (!initialized) {
      setInitialized(true);
    }
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
    figma.notify("Tracking changes, closing plugin will cancel tracking.");
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

  const getAffectedPages = async () => {
    const allAffectedIdsSet = new Set([...createdIds, ...changedIds]);
    const allAffectedIds =  Array.from(allAffectedIdsSet);

    const pageCounts: Record<string, number> = {};

    for (const id of allAffectedIds) {
      const node = await figma.getNodeByIdAsync(id);
      if (!node) continue;

      let current: BaseNode | null = node;
      while (current && current.type !== "PAGE") {
        current = current.parent;
      }

      if (current && current.type === "PAGE") {
        const pageId = current.id;
        pageCounts[pageId] = (pageCounts[pageId] || 0) + 1;
      }
    }

    const mostAffectedPageId = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostAffectedPage = await figma.getNodeByIdAsync(mostAffectedPageId);

    return {
      pages: pageCounts,
      mainPage: mostAffectedPage?.name
    }
  }

  const handleDocumentChange = (event: any) => {
    if (!initialized) return;

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
    }
    if (msg.type === 'show-commit-ui') {
      showCommitUI();
    }
    if (msg.type === 'new-commit') {
      waitForTask(handleNewCommit(msg.payload));
    }
  }

  const handleNewCommit = async (commitMessage: string) => {
    const ipData = await getIpData();
    const pageData = await getAffectedPages();
    const newCommit = {
      id: commitId,
      date: Date.now(),
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
        mainPage: pageData.mainPage
      },
      layers: {
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
    waitForTask(figma.loadAllPagesAsync());
    figma.on("documentchange", handleDocumentChange);
    figma.ui.on('message', handleUIMessages);
    hydrateState();
    return function cleanup() {
      figma.off("documentchange", handleDocumentChange);
      figma.ui.off("message", handleUIMessages);
    };
  });

  return (
    <AutoLayout
      name="container"
      width="hug-contents"
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="start">
      <AutoLayout
        name="new commit"
        minWidth={560}
        width="hug-contents"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        fill={style.color.white}
        cornerRadius={style.cornerRadius.large}
        strokeWidth={8}
        stroke={style.color.black}
        spacing={style.spacing.medium}
        padding={style.padding.medium}>
        <Logo />
        <Diff
          createdIds={createdIds}
          changedIds={changedIds}
          deletedIds={deletedIds} />
        <AutoLayout
          width="fill-parent"
          direction="horizontal"
          spacing={style.spacing.medium}>
          <InitTrackingButton onClick={showTrackingUI} />
          <AddCommitButton onClick={showCommitUI} />
        </AutoLayout>
        <TrackerWarning />
      </AutoLayout>
    </AutoLayout>
  )
};

widget.register(Widget);
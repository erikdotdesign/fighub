import { mergeUnique, getIpData, getCommitTheme, getNodePage } from "./helpers";
import { getThemedStyle, ThemedStyle } from "./style";
import Logo from "./Logo";
import CommitDiff from "./CommitDiff";
import TrackerWarning from "./TrackerWarning";
import Button from "./Button";
import CommitId from "./CommitId";

const { widget } = figma;
const { AutoLayout, Image, Text, useEffect, waitForTask, useSyncedState, useWidgetNodeId } = widget;

const Widget = () => {
  const widgetId = useWidgetNodeId();
  const [style, setStyle] = useSyncedState<ThemedStyle>("style", getThemedStyle("light"));
  const [commits, setCommits] = useSyncedState<any>("commits", []);
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
    figma.notify("Tracking changes, closing plugin window will terminate tracking.");
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
    const allAffectedIds = Array.from(allAffectedIdsSet);

    const pageCounts: Record<string, number> = {};

    for (const id of allAffectedIds) {
      const node = await figma.getNodeByIdAsync(id);
      if (!node) continue;

      const page = getNodePage(node);
      if (page) {
        const pageId = page.id;
        pageCounts[pageId] = (pageCounts[pageId] || 0) + 1;
      }
    }

    const mostAffectedPageId = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostAffectedPage = mostAffectedPageId
      ? await figma.getNodeByIdAsync(mostAffectedPageId)
      : null;

    const widgetNode = await figma.getNodeByIdAsync(widgetId);
    const widgetPage = getNodePage(widgetNode);

    return {
      pages: pageCounts,
      mainPage: mostAffectedPage?.type === "PAGE" ? mostAffectedPage.name : widgetPage.name
    };
  };

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
      showTrackingUI();
    }
  }

  const handleNewCommit = async (commitMessage: string) => {
    const ipData = await getIpData();
    const pageData = await getAffectedPages();
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
      verticalAlignItems="start"
      spacing={style.spacing.large}>
      {
        commits.map((commit) => {
          const commitStyle = getThemedStyle(commit.theme);
          return (
            <AutoLayout
              key={commit.id}
              name="new commit"
              minWidth={560}
              width="hug-contents"
              height="hug-contents"
              direction="vertical"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              fill={commitStyle.color.bg.z0}
              cornerRadius={commitStyle.cornerRadius.large}
              strokeWidth={8}
              stroke={commitStyle.color.primary}
              spacing={commitStyle.spacing.xLarge}
              padding={commitStyle.padding.medium}>
              <AutoLayout
                direction="vertical"
                width="fill-parent"
                height="hug-contents"
                verticalAlignItems="center"
                horizontalAlignItems="center"
                padding={{
                  top: commitStyle.padding.large,
                }}
                spacing={commitStyle.spacing.xLarge}>
                <Image
                  width={72}
                  height={72}
                  src={commit.user.photo}
                  strokeWidth={4}
                  stroke={commitStyle.color.primary}
                  cornerRadius={72} />
                <AutoLayout
                  direction="vertical"
                  width="fill-parent"
                  height="hug-contents"
                  verticalAlignItems="center"
                  horizontalAlignItems="center"
                  spacing={commitStyle.spacing.small}>
                  <Text
                    fontFamily={commitStyle.fontFamily.mono}
                    fontWeight={commitStyle.fontWeight.bold}
                    fontSize={commitStyle.fontSize.medium}
                    lineHeight={commitStyle.lineHeight.medium}
                    fill={commitStyle.color.secondary}
                    textCase="upper">
                    {`${ commit.user.name } worked on`}
                  </Text>
                  <Text
                    fontFamily={commitStyle.fontFamily.mono}
                    fontWeight={commitStyle.fontWeight.bold}
                    fontSize={commitStyle.fontSize.large}
                    lineHeight={commitStyle.lineHeight.large}
                    fill={commitStyle.color.primary}>
                    { commit.pages.main }
                  </Text>
                  {
                    commit.pages.count > 1
                    ? <Text
                        fontFamily={commitStyle.fontFamily.mono}
                        fontWeight={commitStyle.fontWeight.normal}
                        fontSize={commitStyle.fontSize.medium}
                        lineHeight={commitStyle.lineHeight.medium}
                        fill={commitStyle.color.primary}>
                        {`and ${ commit.pages.count - 1 } other ${ commit.pages.count > 2 ? "pages" : "page" }`}
                      </Text>
                    : null
                  }
                </AutoLayout>
              </AutoLayout>
              <AutoLayout
                direction="vertical"
                width="fill-parent"
                height="hug-contents"
                spacing={commitStyle.spacing.medium}>
                <CommitId
                  style={commitStyle}
                  id={commit.id} />
                <CommitDiff
                  style={commitStyle}
                  created={commit.layers.created}
                  changed={commit.layers.changed}
                  deleted={commit.layers.deleted} />
              </AutoLayout>
            </AutoLayout>
          )
        })
      }
       <AutoLayout
        name="new commit"
        minWidth={560}
        width="hug-contents"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        fill={style.color.bg.z0}
        cornerRadius={style.cornerRadius.large}
        strokeWidth={8}
        stroke={style.color.primary}
        spacing={style.spacing.medium}
        padding={style.padding.medium}>
        <Logo style={style} />
        <CommitId
          style={style}
          id={commitId} />
        <CommitDiff
          style={style}
          created={createdIds.length}
          changed={changedIds.length}
          deleted={deletedIds.length} />
        <AutoLayout
          width="fill-parent"
          direction="horizontal"
          spacing={style.spacing.medium}>
          <Button
            fillParent={true}
            style={style}
            text="Init"
            accent={true}
            onClick={showTrackingUI} />
          <Button
            fillParent={true}
            style={style}
            text="Add"
            onClick={showCommitUI} />
        </AutoLayout>
        <TrackerWarning style={style} />
      </AutoLayout>
    </AutoLayout>
  )
};

widget.register(Widget);
import { applyDocumentChangeHandler } from "./helpers";
import style from "./style";
import AddCommitButton from "./AddCommitButton";
import InitTrackingButton from "./InitTrackingButton";
import Logo from "./Logo";
import Diff from "./Diff";
// import MessageInput from "./MessageInput";
import TrackerWarning from "./TrackerWarning";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState } = widget;

const Widget = () => {
  const [commits, setCommits] = useSyncedState<any>("commits", null);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [changedIds, setChangedIds] = useSyncedState<string[]>("changedIds", []);
  const [deletedIds, setDeletedIds] = useSyncedState<string[]>("deletedIds", []);
  // const [commitMessage, setCommitMessage] = useSyncedState<string>("commitMessage", "");

  const showTrackingUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__, {
          width: 245,
          height: 40
        });
      })
    );
    figma.ui.postMessage({ type: "ui-type", payload: "tracking" });
    updateUIDiff();
    figma.notify("Tracking changes, closing plugin will cancel tracking.");
  }

  const showCommitUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__, {
          width: 350,
          height: 516
        });
      })
    );
    figma.ui.postMessage({ type: "ui-type", payload: "commit" });
    updateUIDiff();
  }

  const updateUIDiff = () => {
    figma.ui.postMessage({
      type: "diff",
      payload: {
        created: createdIds.length,
        changed: changedIds.length,
        deleted: deletedIds.length
      }
    });
  }

  useEffect(() => {
    figma.ui.on('message', (msg) => {
      if (msg.type === 'show-tracking-ui') {
        showTrackingUI();
      }
      if (msg.type === 'show-commit-ui') {
        showCommitUI();
      }
      if (msg.type === 'add-commit') {
        console.log(msg.payload);
      }
    });
    try {
      updateUIDiff();
    } catch {
      showTrackingUI();
      waitForTask(applyDocumentChangeHandler(setCreatedIds, setChangedIds, setDeletedIds));
    }
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
        {/* <MessageInput
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage} /> */}
        <AddCommitButton onClick={showCommitUI} />
        <InitTrackingButton onClick={showTrackingUI} />
        <TrackerWarning />
      </AutoLayout>
    </AutoLayout>
  )
};

widget.register(Widget);
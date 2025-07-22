import { applyDocumentChangeHandler } from "./helpers";
import style from "./style";
import AddCommitButton from "./AddCommitButton";
import InitTrackingButton from "./InitTrackingButton";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState } = widget;

const Widget = () => {
  const [commits, setCommits] = useSyncedState<any>("commits", null);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [changedIds, setChangedIds] = useSyncedState<string[]>("changedIds", []);
  const [deletedIds, setDeletedIds] = useSyncedState<string[]>("deletedIds", []);

  const showUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__, {
          height: 40,
          width: 196
        });
      })
    );
    figma.notify("Tracking changes, closing plugin will cancel tracking.");
  }

  useEffect(() => {
    try {
      figma.ui.postMessage({
        type: "diff",
        payload: {
          created: createdIds.length,
          changed: changedIds.length,
          deleted: deletedIds.length
        }
      });
    } catch {
      showUI();
      waitForTask(applyDocumentChangeHandler(setCreatedIds, setChangedIds, setDeletedIds));
    }
  });

  return (
    <AutoLayout
      width="hug-contents"
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="start">
      <AutoLayout
        width="hug-contents"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        fill={style.color.white}
        cornerRadius={style.cornerRadius.large}
        strokeWidth={8}
        stroke={style.color.black}
        spacing={style.spacing.medium}>
        <AddCommitButton onClick={showUI} />
        <InitTrackingButton onClick={showUI} />
      </AutoLayout>
    </AutoLayout>
  )
};

widget.register(Widget);
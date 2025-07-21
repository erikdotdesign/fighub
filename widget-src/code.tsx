import { applyDocumentChangeHandler } from "./helpers";
import style from "./style";
import AddCommitButton from "./AddCommitButton";
import InitTrackingButton from "./InitTrackingButton";

const { widget } = figma;
const { AutoLayout, useEffect, waitForTask, useSyncedState, usePropertyMenu } = widget;

const Widget = () => {
  const [commits, setCommits] = useSyncedState<any>("commits", null);
  const [createdIds, setCreatedIds] = useSyncedState<string[]>("createdIds", []);
  const [changedIds, setChangedIds] = useSyncedState<string[]>("changedIds", []);
  const [deletedIds, setDeletedIds] = useSyncedState<string[]>("deletedIds", []);
  const [tracking, setTracking] = useSyncedState<boolean>("tracking", false); 

  const handleBackgroundTracking = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI("<script></script>", {
          visible: true,
          height: 0,
          width: 0
        });
      })
    );
    figma.notify("Tracking changes, closing plugin will cancel tracking.");
  }

  const handleShowUI = () => {
    waitForTask(
      new Promise(() => {
        figma.showUI(__html__);
      })
    );
  }

  useEffect(() => {
    if (!tracking) {
      setTracking(true);
      handleBackgroundTracking();
    }
    figma.ui.on('message', (msg) => {
      if (msg === 'hide') {
        handleBackgroundTracking();
      }
    });
    waitForTask(applyDocumentChangeHandler(setCreatedIds, setChangedIds, setDeletedIds));
  }, []);

  usePropertyMenu(
    [
      {
        itemType: 'action',
        tooltip: 'Add commit',
        propertyName: 'add-commit',
      },
      { itemType: 'separator', },
      {
        itemType: 'action',
        tooltip: 'Initiate tracking',
        propertyName: 'initiate-tracking',
      },
      // { itemType: 'separator' },
      // {
      //   itemType: 'action',
      //   tooltip: 'Stop tracking',
      //   propertyName: 'stop-tracking',
      // }
    ],
    ({propertyName, propertyValue}) => {
      if (propertyName === "add-commit") {
        handleShowUI();
      } else if (propertyName === "initiate-tracking") {
        handleBackgroundTracking();
      } else if (propertyName === "stop-tracking") {
        figma.closePlugin();
      }
    }
  );

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
        minWidth={560}
        minHeight={1142}
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        fill={style.color.white}
        cornerRadius={style.cornerRadius.large}
        strokeWidth={8}
        stroke={style.color.black}
        spacing={style.spacing.medium}>
        <AddCommitButton onClick={handleShowUI} />
        <InitTrackingButton onClick={handleBackgroundTracking} />
      </AutoLayout>
    </AutoLayout>
  )
};

widget.register(Widget);
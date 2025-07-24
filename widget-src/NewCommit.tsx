import { ThemedStyle } from "./style";
import Logo from "./Logo";
import CommitDiff from "./CommitDiff";
import TrackerWarning from "./TrackerWarning";
import Button from "./Button";
import CommitId from "./CommitId";
import CommitContainer from "./CommitContainer";

const { widget } = figma;
const { AutoLayout } = widget;

const NewCommit = ({
  style,
  commitId,
  createdIds,
  modifiedIds,
  deletedIds,
  showTrackingUI,
  showCommitUI
}: {
  style: ThemedStyle;
  commitId: number;
  createdIds: string[];
  modifiedIds: string[];
  deletedIds: string[];
  showTrackingUI: () => void;
  showCommitUI: () => void;
}) => {
  return (
    <CommitContainer
      style={style}>
      <Logo style={style} />
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={style.spacing.medium}>
        <CommitId
          style={style}
          id={commitId} />
        <CommitDiff
          style={style}
          diff={{
            created: createdIds.length,
            modified: modifiedIds.length,
            deleted: deletedIds.length
          }} />
        <AutoLayout
          width="fill-parent"
          direction="horizontal"
          spacing={style.spacing.medium}>
          <Button
            fillParent={true}
            style={style}
            text="Init"
            onClick={showTrackingUI} />
          <Button
            primary={true}
            fillParent={true}
            style={style}
            text="Add"
            onClick={showCommitUI} />
        </AutoLayout>
        <TrackerWarning style={style} />
      </AutoLayout>
    </CommitContainer>
  )
};

export default NewCommit;
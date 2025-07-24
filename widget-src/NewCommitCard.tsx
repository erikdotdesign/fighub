import { CommitDiff } from "./types";
import { ThemedStyle } from "./style";
import Logo from "./Logo";
import CommitDiffTile from "./CommitDiffTile";
import TrackerWarning from "./TrackerWarning";
import Button from "./Button";
import CommitIdTile from "./CommitIdTile";
import CommitCardContainer from "./CommitCardContainer";

const { widget } = figma;
const { AutoLayout } = widget;

const NewCommitCard = ({
  style,
  commitId,
  diff,
  showTrackingUI,
  showCommitUI
}: {
  style: ThemedStyle;
  commitId: number;
  diff: CommitDiff;
  showTrackingUI: () => void;
  showCommitUI: () => void;
}) => {
  return (
    <CommitCardContainer
      style={style}>
      <Logo style={style} />
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={style.spacing.medium}>
        <CommitIdTile
          style={style}
          id={commitId} />
        <CommitDiffTile
          style={style}
          diff={diff} />
        <AutoLayout
          width="fill-parent"
          direction="horizontal"
          spacing={style.spacing.medium}>
          <Button
            width="fill-parent"
            style={style}
            text="Init"
            onClick={showTrackingUI} />
          <Button
            width="fill-parent"
            primary={true}
            style={style}
            text="Add"
            onClick={showCommitUI} />
        </AutoLayout>
        <TrackerWarning style={style} />
      </AutoLayout>
    </CommitCardContainer>
  )
};

export default NewCommitCard;
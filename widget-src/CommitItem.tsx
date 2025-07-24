import { Commit, CommitDiffItem } from "./types";
import { ThemedStyle } from "./style";
import CommitDiff from "./CommitDiff";
import CommitId from "./CommitId";
import CommitContainer from "./CommitContainer";
import CommitMessage from "./CommitMessage";
import CommitDateTime from "./CommitDateTime";
import CommitLocation from "./CommitLocation";
import DiffChip from "./DiffChip";
import CommitHeader from "./CommitHeader";

const { widget } = figma;
const { AutoLayout } = widget;

const CommitItem = ({
  style,
  commit
}: {
  style: ThemedStyle;
  commit: Commit
}) => {
  return (
    <CommitContainer style={style}>
      <CommitHeader
        style={style}
        commit={commit} />
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={style.spacing.medium}>
        <CommitId
          style={style}
          id={commit.id} />
        <CommitDiff
          style={style}
          diff={commit.diff} />
        <CommitMessage
          style={style}
          message={commit.message} />
        <AutoLayout
          direction="horizontal"
          width="fill-parent"
          height="hug-contents"
          spacing={style.spacing.medium}>
          {
            Object.keys(commit.diff).map((key) => (
              <DiffChip 
                key={key}
                style={style}
                type={key as CommitDiffItem}
                count={commit.diff[key as CommitDiffItem] as number} />
            ))
          }
        </AutoLayout>
        <AutoLayout
          direction="horizontal"
          width="fill-parent"
          height="hug-contents"
          spacing={style.spacing.medium}>
          <CommitDateTime
            style={style}
            timestamp={commit.timestamp} />
          <CommitLocation
            style={style}
            location={commit.location} />
        </AutoLayout>
      </AutoLayout>
    </CommitContainer>
  )
};

export default CommitItem;
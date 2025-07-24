import { Commit, CommitDiffItem } from "./types";
import { ThemedStyle } from "./style";
import CommitDiffTile from "./CommitDiffTile";
import CommitIdTile from "./CommitIdTile";
import CommitCardContainer from "./CommitCardContainer";
import CommitMessageTile from "./CommitMessageTile";
import CommitTimeTile from "./CommitTimeTile";
import CommitLocTile from "./CommitLocTile";
import CommitDiffItemTile from "./CommitDiffItemTile";
import CommitHeader from "./CommitHeader";

const { widget } = figma;
const { AutoLayout } = widget;

const CommitCard = ({
  style,
  commit
}: {
  style: ThemedStyle;
  commit: Commit;
}) => {
  return (
    <CommitCardContainer style={style}>
      <CommitHeader
        style={style}
        commit={commit} />
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={style.spacing.medium}>
        <CommitIdTile
          style={style}
          id={commit.id} />
        <CommitDiffTile
          style={style}
          diff={commit.diff} />
        <CommitMessageTile
          style={style}
          message={commit.message} />
        <AutoLayout
          direction="horizontal"
          width="fill-parent"
          height="hug-contents"
          spacing={style.spacing.medium}>
          {
            Object.keys(commit.diff).map((key) => (
              <CommitDiffItemTile 
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
          <CommitTimeTile
            style={style}
            timestamp={commit.timestamp} />
          <CommitLocTile
            style={style}
            location={commit.location} />
        </AutoLayout>
      </AutoLayout>
    </CommitCardContainer>
  )
};

export default CommitCard;
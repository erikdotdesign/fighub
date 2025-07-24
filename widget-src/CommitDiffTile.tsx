import { CommitDiff } from "./types";
import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text, Span } = widget;

const CommitDiffTile = ({
  style,
  diff
}: {
  style: ThemedStyle;
  diff: CommitDiff;
}) => {
  return (
    <AutoLayout
      direction="horizontal"
      width="fill-parent"
      height="hug-contents"
      spacing="auto"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.bg.z1}
      stroke={style.color.bg.z2}
      strokeWidth={1}>
      <Label 
        style={style}
        text="Diff" />
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}>
        <Span fill={style.color.green}>+{diff.created} </Span>
        <Span fill={style.color.yellow}>±{diff.modified} </Span>
        <Span fill={style.color.red}>-{diff.deleted}</Span>
      </Text>
    </AutoLayout>
  )
};

export default CommitDiffTile;
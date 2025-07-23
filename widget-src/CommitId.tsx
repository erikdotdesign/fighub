import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const CommitId = ({
  style,
  id
}: {
  style: ThemedStyle;
  id: number;
}) => {
  return (
    <AutoLayout
      name="diff"
      direction="horizontal"
      width="fill-parent"
      height="hug-contents"
      spacing="auto"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.bg.z1}>
      <Label 
        style={style}
        text="Commit" />
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.secondary}>
        { id }
      </Text>
    </AutoLayout>
  )
};

export default CommitId;
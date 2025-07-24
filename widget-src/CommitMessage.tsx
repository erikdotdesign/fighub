import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const CommitMessage = ({
  style,
  message
}: {
  style: ThemedStyle;
  message: string
}) => {
  return (
    <AutoLayout
      minHeight={192}
      direction="vertical"
      width="fill-parent"
      height="hug-contents"
      verticalAlignItems="start"
      horizontalAlignItems="start"
      padding={style.padding.shmedium}
      spacing={style.spacing.small}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.bg.z1}
      stroke={style.color.bg.z2}
      strokeWidth={1}>
      <Label
        style={style}
        text="Message" />
      <Text
        width="fill-parent"
        height="fill-parent"
        verticalAlignText="top"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.normal}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.primary}>
        { message }
      </Text>
    </AutoLayout>
  )
};

export default CommitMessage;
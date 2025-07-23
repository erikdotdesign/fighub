import { ThemedStyle } from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const TrackerWarning = ({
  style
}: {
  style: ThemedStyle
}) => {
  return (
    <AutoLayout
      width="fill-parent"
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.red}>
        Closing plugin window (X) will terminate tracking
      </Text>
    </AutoLayout>
  )
};

export default TrackerWarning;
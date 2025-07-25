import { ThemedStyle } from "./style";
import { getDayName, formatDateWithOrdinal, formatTime } from "./helpers";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const CommitTimeTile = ({
  style,
  timestamp
}: {
  style: ThemedStyle;
  timestamp: number;
}) => {
  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      height={236}
      padding={style.padding.shmedium}
      spacing={style.spacing.small}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.bg.z1}
      stroke={style.color.bg.z2}
      strokeWidth={1}>
      <Label
        style={style}
        text="When" />
      <Text
        width="fill-parent"
        height="fill-parent"
        verticalAlignText="top"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.semiBold}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fill={style.color.primary}>
        { getDayName(timestamp) }
      </Text>
      <Text
        width="fill-parent"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.primary}>
        { formatDateWithOrdinal(timestamp) }
      </Text>
      <Text
        width="fill-parent"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.normal}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.primary}>
        { formatTime(timestamp) }
      </Text>
    </AutoLayout>
  )
};

export default CommitTimeTile;
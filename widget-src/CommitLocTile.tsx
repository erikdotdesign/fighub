import { CommitLocation } from "./types";
import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const CommitLocTile = ({
  style,
  location
}: {
  style: ThemedStyle;
  location: CommitLocation;
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
        text="Where" />
      <Text
        width="fill-parent"
        height="fill-parent"
        verticalAlignText="top"
        truncate={2}
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.semiBold}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fill={style.color.primary}>
        { location.region }
      </Text>
      <Text
        width="fill-parent"
        truncate={1}
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.primary}>
        { location.country }
      </Text>
      <Text
        width="fill-parent"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.normal}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.primary}>
        { location.postal }
      </Text>
    </AutoLayout>
  )
};

export default CommitLocTile;
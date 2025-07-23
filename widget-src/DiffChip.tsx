import { capitalize } from "./helpers";
import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const DiffChip = ({
  style,
  type,
  count
}: {
  style: ThemedStyle;
  type: "created" | "changed" | "deleted",
  count: number;
}) => {

  const getColor = () => {
    const { color } = style;
    switch(type) {
      case "created":
        return color.green;
      case "changed":
        return color.yellow;
      case "deleted":
        return color.red;
    }
  }

  const getSymbol = () => {
    switch(type) {
      case "created":
        return "+";
      case "changed":
        return "±";
      case "deleted":
        return "-";
    }
  }

  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      height={148}
      padding={style.padding.shmedium}
      spacing={style.spacing.small}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.bg.z1}
      stroke={style.color.bg.z2}
      strokeWidth={1}>
      <Label
        style={style}
        text={capitalize(type)} />
      <Text
        height="fill-parent"
        verticalAlignText="top"
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.semiBold}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fill={getColor()}>
        {`${getSymbol()}${count}`}
      </Text>
    </AutoLayout>
  )
};

export default DiffChip;
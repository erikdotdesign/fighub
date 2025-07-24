import { ThemedStyle } from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const Button = ({
  width,
  style,
  primary,
  text,
  onClick
}: {
  width?: WidgetJSX.AutolayoutSize;
  style: ThemedStyle;
  primary?: boolean;
  text: string;
  onClick: () => void;
}) => {
  return (
    <AutoLayout
      width={width ? width : "hug-contents"}
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      strokeWidth={primary ? 0 : 1}
      stroke={primary ? undefined : style.color.bg.z2}
      fill={primary ? style.color.primary : style.color.bg.z1}
      onClick={onClick}
      spacing={style.spacing.small}
      hoverStyle={{
        fill: primary ? style.color.hover.primary : style.color.bg.z2,
        stroke: primary ? undefined : style.color.bg.z3
      }}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={primary ? style.color.accent : style.color.primary}>
        { text }
      </Text>
    </AutoLayout>
  )
};

export default Button;
import { ThemedStyle } from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const Button = ({
  fillParent,
  style,
  accent,
  text,
  onClick
}: {
  fillParent?: boolean,
  style: ThemedStyle;
  accent?: boolean;
  text: string;
  onClick: () => void;
}) => {
  return (
    <AutoLayout
      name="button"
      width={fillParent ? "fill-parent" : "hug-contents"}
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      strokeWidth={accent ? 2 : 0}
      stroke={accent ? style.color.primary : undefined}
      fill={accent ? style.color.accent : style.color.primary}
      onClick={onClick}
      spacing={style.spacing.small}
      hoverStyle={{
        fill: accent ? style.color.hover.accent : style.color.hover.primary
      }}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={accent ? style.color.primary : style.color.accent}>
        { text }
      </Text>
    </AutoLayout>
  )
};

export default Button;
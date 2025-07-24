import { ThemedStyle } from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const Logo = ({
  style
}: {
  style: ThemedStyle;
}) => {
  return (
    <AutoLayout
      direction="horizontal"
      width="fill-parent"
      height="hug-contents"
      horizontalAlignItems="center">
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fill={style.color.primary}>
        fighub
      </Text>
    </AutoLayout>
  )
};

export default Logo;
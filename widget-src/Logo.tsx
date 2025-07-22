import style from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const Logo = () => {
  return (
    <AutoLayout
      name="logo"
      direction="horizontal"
      width="fill-parent"
      height="hug-contents"
      horizontalAlignItems="center"
      padding={{
        vertical: style.padding.medium
      }}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fill={style.color.black}>
        fighub
      </Text>
    </AutoLayout>
  )
};

export default Logo;
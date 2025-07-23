import style from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const InitTrackingButton = ({
  onClick
}: {
  onClick: () => void;
}) => {
  return (
    <AutoLayout
      name="init tracking button"
      width="fill-parent"
      height="hug-contents"
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      strokeWidth={2}
      stroke={style.color.black}
      onClick={onClick}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.black}>
        Init
      </Text>
    </AutoLayout>
  )
};

export default InitTrackingButton;
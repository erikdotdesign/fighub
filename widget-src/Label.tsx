import style from "./style";

const { widget } = figma;
const { Text } = widget;

const Label = ({
  text
}: {
  text: string;
}) => {
  return (
    <Text
      fontFamily={style.fontFamily.mono}
      fontWeight={style.fontWeight.bold}
      fontSize={style.fontSize.medium}
      lineHeight={style.lineHeight.medium}
      fill={style.color.gray}
      textCase="upper">
      { text }
    </Text>
  )
};

export default Label;
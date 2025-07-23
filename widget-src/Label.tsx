import { ThemedStyle } from "./style";

const { widget } = figma;
const { Text } = widget;

const Label = ({
  style,
  text
}: {
  style: ThemedStyle;
  text: string;
}) => {
  return (
    <Text
      fontFamily={style.fontFamily.mono}
      fontWeight={style.fontWeight.bold}
      fontSize={style.fontSize.medium}
      lineHeight={style.lineHeight.medium}
      fill={style.color.secondary}
      // textCase="upper"
      >
      { text }
    </Text>
  )
};

export default Label;
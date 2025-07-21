import style from "./style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

const AddCommitButton = ({
  onClick
}: {
  onClick: () => void;
}) => {
  return (
    <AutoLayout
      minWidth={196}
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      strokeWidth={2}
      stroke={style.color.black}
      fill={style.color.black}
      onClick={onClick}>
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.white}>
        Add commit
      </Text>
    </AutoLayout>
  )
};

export default AddCommitButton;
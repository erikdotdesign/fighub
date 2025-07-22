import style from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Text, Span } = widget;

const Diff = ({
  changedIds,
  createdIds,
  deletedIds
}: {
  changedIds: string[];
  createdIds: string[];
  deletedIds: string[];
}) => {
  return (
    <AutoLayout
      name="diff"
      direction="horizontal"
      width="fill-parent"
      height="hug-contents"
      spacing="auto"
      verticalAlignItems="center"
      padding={style.padding.shmedium}
      cornerRadius={style.cornerRadius.medium}
      fill={style.color.lightGray}>
      <Label text="Layers changed" />
      <Text
        fontFamily={style.fontFamily.mono}
        fontWeight={style.fontWeight.bold}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fill={style.color.white}>
        <Span fill={style.color.green}>+{createdIds.length} </Span>
        <Span fill={style.color.yellow}>+{changedIds.length} </Span>
        <Span fill={style.color.red}>-{deletedIds.length}</Span>
      </Text>
    </AutoLayout>
  )
};

export default Diff;
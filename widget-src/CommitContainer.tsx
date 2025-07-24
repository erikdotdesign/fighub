import { ThemedStyle } from "./style";

const { widget } = figma;
const { AutoLayout } = widget;

const CommitContainer = ({
  style,
  children
}: {
  style: ThemedStyle;
  children: any[];
}) => {

  return (
    <AutoLayout
      minWidth={560}
      width="hug-contents"
      height="hug-contents"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      fill={style.color.bg.z0}
      cornerRadius={style.cornerRadius.large}
      strokeWidth={8}
      stroke={style.color.primary}
      spacing={style.spacing.xLarge}
      padding={{
        top: style.padding.xLarge,
        right: style.padding.medium,
        bottom: style.padding.medium,
        left: style.padding.medium
      }}>
      {
        ...children
      }
    </AutoLayout>
  )
};

export default CommitContainer;
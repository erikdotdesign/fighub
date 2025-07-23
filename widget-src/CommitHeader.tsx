import { ThemedStyle } from "./style";
import Label from "./Label";

const { widget } = figma;
const { AutoLayout, Image, Text } = widget;

const CommitHeader = ({
  style,
  commit
}: {
  style: ThemedStyle;
  commit: any
}) => {
  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      height="hug-contents"
      verticalAlignItems="center"
      horizontalAlignItems="center"
      padding={{
        top: style.padding.medium
      }}
      spacing={style.spacing.xLarge}>
      <Image
        width={72}
        height={72}
        src={commit.user.photo}
        strokeWidth={4}
        stroke={style.color.primary}
        cornerRadius={72} />
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        verticalAlignItems="center"
        horizontalAlignItems="center"
        spacing={style.spacing.small}>
        <Label 
          style={style}
          text={`${ commit.user.name } worked on`} />
        <Text
          fontFamily={style.fontFamily.mono}
          fontWeight={style.fontWeight.bold}
          fontSize={style.fontSize.large}
          lineHeight={style.lineHeight.large}
          fill={style.color.primary}>
          { commit.pages.main }
        </Text>
        {
          commit.pages.count > 1
          ? <Text
              fontFamily={style.fontFamily.mono}
              fontWeight={style.fontWeight.normal}
              fontSize={style.fontSize.medium}
              lineHeight={style.lineHeight.medium}
              fill={style.color.primary}>
              {`and ${ commit.pages.count - 1 } other ${ commit.pages.count > 2 ? "pages" : "page" }`}
            </Text>
          : null
        }
      </AutoLayout>
    </AutoLayout>
  )
};

export default CommitHeader;
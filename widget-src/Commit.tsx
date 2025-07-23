import { ThemedStyle } from "./style";
import { getDayName, formatDateWithOrdinal, formatTime } from "./helpers";
import CommitDiff from "./CommitDiff";
import CommitId from "./CommitId";
import CommitContainer from "./CommitContainer";
import CommitMessage from "./CommitMessage";
import CommitDateTime from "./CommitDateTime";
import CommitLocation from "./CommitLocation";

const { widget } = figma;
const { AutoLayout, Image, Text } = widget;

const Commit = ({
  style,
  commit
}: {
  style: ThemedStyle;
  commit: any
}) => {
  return (
    <CommitContainer style={style}>
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
          <Text
            fontFamily={style.fontFamily.mono}
            fontWeight={style.fontWeight.bold}
            fontSize={style.fontSize.medium}
            lineHeight={style.lineHeight.medium}
            fill={style.color.secondary}
            textCase="upper">
            {`${ commit.user.name } worked on`}
          </Text>
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
      <AutoLayout
        direction="vertical"
        width="fill-parent"
        height="hug-contents"
        spacing={style.spacing.medium}>
        <CommitId
          style={style}
          id={commit.id} />
        <CommitDiff
          style={style}
          created={commit.layers.created}
          changed={commit.layers.changed}
          deleted={commit.layers.deleted} />
        <CommitMessage
          style={style}
          message={commit.message} />
        <AutoLayout
          direction="horizontal"
          width="fill-parent"
          height="hug-contents"
          spacing={style.spacing.medium}>
          <CommitDateTime
            style={style}
            date={commit.date} />
          <CommitLocation
            style={style}
            location={commit.location} />
        </AutoLayout>
      </AutoLayout>
    </CommitContainer>
  )
};

export default Commit;
import style from "./style";

const { widget } = figma;
const { Input } = widget;

const MessageInput = ({
  commitMessage,
  setCommitMessage
}: {
  commitMessage: string;
  setCommitMessage: (commitMessage: string) => void;
}) => {

  const handleBlur = (e: any) => {
    setCommitMessage(e.characters);
  }

  return (
    <Input
      value={commitMessage}
      onTextEditEnd={handleBlur}
      placeholder="Add commit message (required)..."
      inputFrameProps={{
        name:"input",
        width: "fill-parent",
        height: "hug-contents",
        padding: {
          vertical: style.padding.small,
          horizontal: style.padding.shmedium
        },
        fill: style.color.lightGray,
        cornerRadius: style.cornerRadius.medium
      }}
      placeholderProps={{
        fontFamily: style.fontFamily.sansSerif,
        fontSize: style.fontSize.medium,
        fontWeight: style.fontWeight.normal,
        lineHeight: style.lineHeight.medium,
        fill: style.color.gray,
        opacity: 1
      }}
      width="fill-parent"
      height={144}
      fontFamily={style.fontFamily.sansSerif}
      fontSize={style.fontSize.medium}
      fontWeight={style.fontWeight.normal}
      lineHeight={style.lineHeight.medium}
      fill={style.color.black}
      inputBehavior="multiline" />
  )
}

export default MessageInput;
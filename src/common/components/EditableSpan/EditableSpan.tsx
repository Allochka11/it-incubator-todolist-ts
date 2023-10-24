import React, { ChangeEvent, useState } from "react";
import { TextField } from "@mui/material";

type EditableSpanPropsType = {
  value: string;
  onChange: (newValue: string) => void;
};

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState(props.value);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(props.value);
  };
  const activateViewMode = () => {
    setEditMode(false);
    if (title.length > 0) {
      props.onChange(title);
    }
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const activateViewModeOnEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (title.length > 0) {
        setEditMode(false);
        props.onChange(title);
      }
    }
  };

  return editMode ? (
    <TextField
      value={title}
      onChange={changeTitle}
      autoFocus
      onBlur={activateViewMode}
      onKeyDown={(event) => {
        activateViewModeOnEnter(event);
      }}
    />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  );
});

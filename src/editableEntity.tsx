import * as React from "react";

import { BlockProtocolProps } from "blockprotocol";

type EditableOptions<T> = {
  value: T;
  isEditable: boolean;
  edit(): void;
  clickToEdit: { onClick: React.MouseEventHandler };
} & (
  | {
      isEditing: false;
    }
  | {
      isEditing: true;
      editingUI: JSX.Element;
    }
);

export function editableEntity<BlockProps>(
  initialEntity: BlockProps & BlockProtocolProps
): <P extends keyof BlockProps>(
  key: P,
  renderFn: (view: EditableOptions<BlockProps[P]>) => JSX.Element
  // editFn: (editing: { ui: JSX.Element | null }) => JSX.Element
) => JSX.Element {
  return function useEditableProp(key, renderFn) {
    const [editing, setEditing] = React.useState(false);
    const [saveValue, setSaveValue] = React.useState(initialEntity[key]);
    const [value, setValue] = React.useState(saveValue);

    // in case the value updates
    React.useEffect(() => {
      console.log(initialEntity[key], { key, initialEntity });
      setSaveValue(initialEntity[key]);
    }, [initialEntity[key]]);

    return renderFn({
      value,
      edit() {
        if (!editing) {
          setEditing(true);
        }
      },
      clickToEdit: {
        onClick() {
          if (!editing) {
            setEditing(true);
          }
        },
      },
      isEditing: editing,
      isEditable: true, // TODO: wire up based on protocol writability
      editingUI: editing ? (
        <div className="editor-value">
          <EditingUI
            label={key as string}
            value={value}
            setValue={setValue}
            dismiss={() => {
              setEditing(false);
              setValue(saveValue);
            }}
            saveValue={() => {
              setSaveValue(value);
              setEditing(false);
            }}
          />
        </div>
      ) : undefined,
    });
  };
}

function EditingUI<T>(props: {
  label?: string;
  value: T;
  setValue(updated: T): void;
  saveValue(): void;
  dismiss(): void;
}) {
  return (
    <label className="editing-ui">
      {/* {props.label && <div className="editing--label">{props.label}</div>} */}
      <input
        style={{
          font: "inherit",
          color: "inherit",
          background: "transparent",
          border: "none",
        }}
        value={props.value as any}
        autoFocus
        onInput={function (evt) {
          props.setValue(evt.target["value"]);
        }}
        onKeyDown={(evt) => {
          if (evt.key === "Enter") {
            props.saveValue();
          } else if (evt.key === "Escape") {
            props.dismiss();
          }
        }}
      />
      <div className="editing-ui--controls">
        <button {...clickOrEnter(props.dismiss)}>× Dismiss</button>
        <button {...clickOrEnter(props.saveValue)}>✓ Save</button>
      </div>
    </label>
  );
}

function clickOrEnter(then: () => void) {
  return {
    onClick(evt: React.MouseEvent) {
      if (evt.button === 0) {
        evt.stopPropagation();
        then();
      }
    },
    onKeydown(evt: React.KeyboardEvent) {
      if (evt.key === "Enter") {
        evt.stopPropagation();
        then();
      }
    },
  };
}

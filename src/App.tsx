import * as React from "react";

import "./App.css";

import { BlockComponent } from "blockprotocol/react";
import { editableEntity } from "./editableEntity";

type AppProps = {
  productTitle: string;
  productDescription: string;
  productImageURL: string;
  productLinkURL: string; // URL
};

export const App: BlockComponent<AppProps> = (props) => {
  const useEditable = editableEntity(props);
  const productTitle = useEditable("productTitle", (view) => (
    <h3 className="empty-placeholder" {...view.clickToEdit}>
      {view.isEditing ? view.editingUI : view.value}
    </h3>
  ));
  const productImage = useEditable("productImageURL", (view) => (
    <>
      <img
        {...view.clickToEdit}
        src={view.value}
        style={{
          width: "auto",
          minWidth: "4rem",
          maxWidth: "10rem",
          height: "auto",
          minHeight: "4rem",
          maxHeight: "10rem",
        }}
      />
      {view.isEditing && (
        // absolute to hover below
        <div
          style={{
            position: "absolute",
            background: "white",
            padding: "1rem",
            zIndex: 1,
          }}
        >
          {view.editingUI}
        </div>
      )}
    </>
  ));
  const productDescription = useEditable("productDescription", (view) => (
    <p
      {...view.clickToEdit}
      className="empty-placeholder"
      style={{ fontSize: "0.8rem", opacity: "0.8" }}
    >
      {view.isEditing ? view.editingUI : view.value}
    </p>
  ));

  const productLinkTile = useEditable("productLinkURL", (view) => {
    return (
      <a
        href={view.value}
        className="simple-product-link"
        style={{ display: "block", textDecoration: "none" }}
        onContextMenu={(evt) => {
          // right click
          view.edit();
        }}
      >
        {productTitle}
        {productImage}
        {productDescription}
        {view.isEditing ? (
          <div>Edit URL: {view.editingUI}</div>
        ) : view.isEditable ? (
          <button {...view.clickToEdit}>Edit URL</button>
        ) : null}
      </a>
    );
  });

  return productLinkTile;
};

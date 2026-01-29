import React from "react";
import FileItem from "./FileItem";

export default function FileGrid({ files = [], folders = [], view = "grid", openFile, trashActions = {}, loading }) {
  if (loading) return <div>Loading...</div>;
  if (!files.length && !folders.length) return <div>No items found</div>;

  return (
    <div
      className={`grid gap-4 ${
        view === "grid"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {folders.map((folder) => (
        <FileItem key={folder.id} item={folder} isGrid={view === "grid"} />
      ))}
      {files.map((file) => (
        <FileItem key={file.id} item={file} isGrid={view === "grid"} />
      ))}
    </div>
  );
}

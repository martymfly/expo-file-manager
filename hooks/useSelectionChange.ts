import React, { useState, useEffect } from "react";
import { fileItem } from "../types";

export default function useSelectionChange(items: fileItem[]) {
  const [multiSelect, setMultiSelect] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    if (items.filter((i) => i.selected).length > 0) {
      setMultiSelect(true);
    } else {
      setMultiSelect(false);
    }
    if (items.filter((i) => i.selected).length === items.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [items]);
  return { multiSelect, allSelected };
}

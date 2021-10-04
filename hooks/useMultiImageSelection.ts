import { useState, useEffect } from "react";
import { ExtendedAsset } from "../types";

export default function useSelectionChange(items: ExtendedAsset[]) {
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (items.filter((i) => i.selected).length > 0) {
      setIsSelecting(true);
    } else {
      setIsSelecting(false);
    }
  }, [items]);
  return isSelecting;
}

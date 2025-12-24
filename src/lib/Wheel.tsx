import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export interface WheelClassNames {
  root?: string;
  viewport?: string;
  item?: string;
  selectedItem?: string;
  overlayTop?: string;
  overlayBottom?: string;
  indicator?: string;
}

export interface WheelStyles {
  root?: CSSProperties;
  viewport?: CSSProperties;
  item?: CSSProperties;
  selectedItem?: CSSProperties;
  overlayTop?: CSSProperties;
  overlayBottom?: CSSProperties;
  indicator?: CSSProperties;
}

export interface WheelProps<T> {
  items: T[];
  value: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  width?: string | number;
  renderItem?: (item: T, index: number, isSelected: boolean) => ReactNode;
  classNames?: WheelClassNames;
  styles?: WheelStyles;
  disabled?: boolean;
  "aria-label"?: string;
  getItemLabel?: (item: T, index: number) => string;
}
export function Wheel<T>({
  items,
  value,
  onChange,
  itemHeight = 40,
  visibleCount = 5,
  width = "100%",
  renderItem,
  classNames = {},
  styles = {},
  disabled = false,
  "aria-label": ariaLabel,
  getItemLabel,
}: WheelProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollEndTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const [internalValue, setInternalValue] = useState(value);

  const containerHeight = visibleCount * itemHeight;
  const paddingHeight = Math.floor(visibleCount / 2) * itemHeight;

  const scrollToIndex = useCallback(
    (index: number, smooth: boolean = true) => {
      if (viewportRef.current) {
        const targetScroll = index * itemHeight;
        if (smooth) {
          viewportRef.current.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
        } else {
          viewportRef.current.scrollTop = targetScroll;
        }
      }
    },
    [itemHeight]
  );

  useEffect(() => {
    if (!isUserScrolling.current && value !== internalValue) {
      setInternalValue(value);
      scrollToIndex(value, false);
    }
  }, [value, internalValue, scrollToIndex]);

  useEffect(() => {
    scrollToIndex(internalValue, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalizeSelection = useCallback(() => {
    if (!viewportRef.current) return;

    const scrollTop = viewportRef.current.scrollTop;
    const newIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));

    viewportRef.current.scrollTo({
      top: clampedIndex * itemHeight,
      behavior: "smooth",
    });

    isUserScrolling.current = false;
    isDragging.current = false;

    if (clampedIndex !== internalValue) {
      setInternalValue(clampedIndex);
      onChange(clampedIndex);
    }
  }, [itemHeight, items.length, internalValue, onChange]);

  const handleScroll = useCallback(() => {
    if (isDragging.current) return;

    isUserScrolling.current = true;

    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current);
    }

    scrollEndTimeout.current = setTimeout(() => {
      finalizeSelection();
    }, 100);
  }, [finalizeSelection]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.button !== 0) return;

      isDragging.current = true;
      isUserScrolling.current = true;
      dragStartY.current = e.clientY;
      dragStartScrollTop.current = viewportRef.current?.scrollTop || 0;

      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || !viewportRef.current) return;

      const deltaY = dragStartY.current - e.clientY;
      const newScrollTop = dragStartScrollTop.current + deltaY;

      const maxScroll = (items.length - 1) * itemHeight;
      viewportRef.current.scrollTop = Math.max(
        0,
        Math.min(maxScroll, newScrollTop)
      );
    },
    [items.length, itemHeight]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);

      scrollEndTimeout.current = setTimeout(() => {
        finalizeSelection();
      }, 50);
    },
    [finalizeSelection]
  );

  const handleItemClick = useCallback(
    (index: number) => {
      if (disabled || isDragging.current) return;
      setInternalValue(index);
      onChange(index);
      scrollToIndex(index, true);
    },
    [disabled, scrollToIndex, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      let newIndex = internalValue;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newIndex = Math.max(0, internalValue - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          newIndex = Math.min(items.length - 1, internalValue + 1);
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = items.length - 1;
          break;
        case "PageUp":
          e.preventDefault();
          newIndex = Math.max(0, internalValue - visibleCount);
          break;
        case "PageDown":
          e.preventDefault();
          newIndex = Math.min(items.length - 1, internalValue + visibleCount);
          break;
        default:
          return;
      }

      if (newIndex !== internalValue) {
        setInternalValue(newIndex);
        onChange(newIndex);
        scrollToIndex(newIndex, true);
        itemRefs.current.get(newIndex)?.focus();
      }
    },
    [
      disabled,
      internalValue,
      items.length,
      visibleCount,
      onChange,
      scrollToIndex,
    ]
  );

  useEffect(() => {
    return () => {
      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }
    };
  }, []);

  const defaultGetItemLabel = (item: T): string => {
    return String(item);
  };

  const getLabel = getItemLabel || defaultGetItemLabel;

  const defaultRenderItem = (item: T): ReactNode => {
    return String(item);
  };

  const render = renderItem || defaultRenderItem;

  return (
    <div
      className={classNames.root}
      style={{
        position: "relative",
        height: containerHeight,
        width: width,
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        cursor: disabled ? "default" : "grab",
        ...styles.root,
      }}
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={`wheel-item-${internalValue}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={classNames.overlayTop}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: paddingHeight,
          zIndex: 10,
          pointerEvents: "none",
          ...styles.overlayTop,
        }}
        aria-hidden="true"
      />

      <div
        className={classNames.overlayBottom}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: paddingHeight,
          zIndex: 10,
          pointerEvents: "none",
          ...styles.overlayBottom,
        }}
        aria-hidden="true"
      />

      <div
        className={classNames.indicator}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: itemHeight,
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 5,
          ...styles.indicator,
        }}
        aria-hidden="true"
      />

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className={classNames.viewport}
        style={{
          height: "100%",
          overflowY: disabled ? "hidden" : "auto",
          scrollbarWidth: "none",
          ...styles.viewport,
        }}
      >
        <div style={{ height: paddingHeight }} aria-hidden="true" />

        {items.map((item, index) => {
          const isSelected = index === internalValue;

          return (
            <button
              key={index}
              id={`wheel-item-${index}`}
              ref={(el) => {
                if (el) itemRefs.current.set(index, el);
                else itemRefs.current.delete(index);
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-label={getLabel(item, index)}
              disabled={disabled}
              onClick={() => handleItemClick(index)}
              className={`${classNames.item || ""} ${
                isSelected ? classNames.selectedItem || "" : ""
              }`}
              style={{
                height: itemHeight,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: disabled ? "default" : "pointer",
                ...styles.item,
                ...(isSelected ? styles.selectedItem : {}),
              }}
              tabIndex={-1}
            >
              {render(item, index, isSelected)}
            </button>
          );
        })}

        <div style={{ height: paddingHeight }} aria-hidden="true" />
      </div>

      <style>{`
        div[style*="overflow"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

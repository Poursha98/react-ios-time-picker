import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useId,
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "../utils";

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

export interface WheelProps<T = unknown> {
  /** Array of items to display */
  items: T[];
  /** Currently selected index */
  value: number;
  /** Called when selection changes */
  onChange: (index: number) => void;
  /** Height of each item in pixels */
  itemHeight?: number;
  /** Number of visible items */
  visibleCount?: number;
  /** Width of the wheel */
  width?: string | number;
  /** Custom item renderer */
  renderItem?: (item: T, index: number, isSelected: boolean) => ReactNode;
  /** Class names for sub-elements */
  classNames?: WheelClassNames;
  /** Inline styles for sub-elements */
  styles?: WheelStyles;
  /** Disable the wheel */
  disabled?: boolean;
  /** Accessibility label */
  "aria-label"?: string;
  /** Get accessible label for an item */
  getItemLabel?: (item: T, index: number) => string;
  /** Unique ID for the wheel (auto-generated if not provided) */
  id?: string;
  /** Enable infinite looping */
  loop?: boolean;
  /** Additional data attributes */
  [key: `data-${string}`]: string | undefined;
}

export const Wheel = forwardRef<HTMLDivElement, WheelProps>(
  <T,>(
    {
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
      id: providedId,
      loop = false,
      ...props
    }: WheelProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const generatedId = useId();
    const wheelId = providedId ?? `wheel-${generatedId}`;

    const viewportRef = useRef<HTMLDivElement>(null);
    const isUserScrolling = useRef(false);
    const scrollEndTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    const isDragging = useRef(false);
    const dragStartY = useRef(0);
    const dragStartScrollTop = useRef(0);

    const [internalValue, setInternalValue] = useState(value);

    // If looping, we render 3 sets of items.
    const displayItems = loop ? [...items, ...items, ...items] : items;
    const itemsLength = items.length;

    const containerHeight = visibleCount * itemHeight;
    const paddingHeight = Math.floor(visibleCount / 2) * itemHeight;

    const scrollToIndex = useCallback(
      (index: number, smooth: boolean = true) => {
        if (viewportRef.current) {
          const targetIndex = loop ? index + itemsLength : index;
          const targetScroll = targetIndex * itemHeight;

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
      [itemHeight, loop, itemsLength]
    );

    useEffect(() => {
      if (!isUserScrolling.current && value !== internalValue) {
        setInternalValue(value);
        scrollToIndex(value, false);
      }
    }, [value, internalValue, scrollToIndex]);

    useEffect(() => {
      // Initial scroll
      scrollToIndex(internalValue, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoopScroll = useCallback(() => {
      if (!loop || !viewportRef.current) return;

      const scrollTop = viewportRef.current.scrollTop;
      const totalHeight = itemsLength * itemHeight;
      const setHeight = totalHeight;

      if (scrollTop < setHeight / 2) {
        viewportRef.current.scrollTop = scrollTop + setHeight;
      } else if (scrollTop > setHeight * 2.5) {
        viewportRef.current.scrollTop = scrollTop - setHeight;
      }
    }, [loop, itemsLength, itemHeight]);

    const finalizeSelection = useCallback(() => {
      if (!viewportRef.current) return;

      let scrollTop = viewportRef.current.scrollTop;

      if (loop) {
        const setHeight = itemsLength * itemHeight;
        const offsetInSet = scrollTop % setHeight;
        const normalizedScrollTop = setHeight + offsetInSet;

        if (Math.abs(scrollTop - normalizedScrollTop) > 1) {
          viewportRef.current.scrollTop = normalizedScrollTop;
          scrollTop = normalizedScrollTop;
        }
      }

      const rawIndex = Math.round(scrollTop / itemHeight);

      let finalIndex: number;
      if (loop) {
        finalIndex = rawIndex % itemsLength;
      } else {
        finalIndex = Math.max(0, Math.min(items.length - 1, rawIndex));
      }

      const snapTargetIndex = loop ? finalIndex + itemsLength : finalIndex;

      viewportRef.current.scrollTo({
        top: snapTargetIndex * itemHeight,
        behavior: "smooth",
      });

      isUserScrolling.current = false;
      isDragging.current = false;

      if (finalIndex !== internalValue) {
        setInternalValue(finalIndex);
        onChange(finalIndex);
      }
    }, [itemHeight, items.length, itemsLength, internalValue, onChange, loop]);

    const handleScroll = useCallback(() => {
      if (loop) {
        handleLoopScroll();
      }

      if (isDragging.current) return;

      isUserScrolling.current = true;

      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }

      scrollEndTimeout.current = setTimeout(() => {
        finalizeSelection();
      }, 100);
    }, [finalizeSelection, loop, handleLoopScroll]);

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

        if (!loop) {
          const maxScroll = (items.length - 1) * itemHeight;
          viewportRef.current.scrollTop = Math.max(
            0,
            Math.min(maxScroll, newScrollTop)
          );
        } else {
          viewportRef.current.scrollTop = newScrollTop;
          handleLoopScroll();
        }
      },
      [items.length, itemHeight, loop, handleLoopScroll]
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

        const realIndex = loop ? index % itemsLength : index;

        setInternalValue(realIndex);
        onChange(realIndex);
        scrollToIndex(realIndex, true);
      },
      [disabled, scrollToIndex, onChange, loop, itemsLength]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        let newIndex = internalValue;

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            newIndex = internalValue - 1;
            if (newIndex < 0) {
              newIndex = loop ? itemsLength - 1 : 0;
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            newIndex = internalValue + 1;
            if (newIndex >= itemsLength) {
              newIndex = loop ? 0 : itemsLength - 1;
            }
            break;
          case "Home":
            e.preventDefault();
            newIndex = 0;
            break;
          case "End":
            e.preventDefault();
            newIndex = itemsLength - 1;
            break;
          case "PageUp":
            e.preventDefault();
            // Simple approx for PageUp
            newIndex = internalValue - visibleCount;
            if (newIndex < 0)
              newIndex = loop ? (newIndex + itemsLength) % itemsLength : 0;
            break;
          case "PageDown":
            e.preventDefault();
            newIndex = internalValue + visibleCount;
            if (newIndex >= itemsLength)
              newIndex = loop ? newIndex % itemsLength : itemsLength - 1;
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
        itemsLength,
        visibleCount,
        onChange,
        scrollToIndex,
        loop,
      ]
    );

    useEffect(() => {
      return () => {
        if (scrollEndTimeout.current) {
          clearTimeout(scrollEndTimeout.current);
        }
      };
    }, []);

    useEffect(() => {
      itemRefs.current.clear();
    }, [items.length]);

    const defaultGetItemLabel = (item: T): string => {
      return String(item);
    };

    const getLabel = getItemLabel || defaultGetItemLabel;

    const defaultRenderItem = (item: T): ReactNode => {
      return String(item);
    };

    const render = renderItem || defaultRenderItem;

    const dataAttributes: Record<string, string | undefined> = {};
    for (const key of Object.keys(props)) {
      if (key.startsWith("data-")) {
        dataAttributes[key] = (props as Record<string, string | undefined>)[
          key
        ];
      }
    }

    return (
      <div
        ref={ref}
        className={cn("wheel", classNames.root)}
        style={{
          position: "relative",
          height: containerHeight,
          width: width,
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          ...styles.root,
        }}
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={`${wheelId}-item-${internalValue}`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        data-wheel=""
        data-disabled={disabled || undefined}
        {...dataAttributes}
      >
        <div
          className={cn("wheel-overlay-top", classNames.overlayTop)}
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
          data-wheel-overlay="top"
          aria-hidden="true"
        />

        <div
          className={cn("wheel-overlay-bottom", classNames.overlayBottom)}
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
          data-wheel-overlay="bottom"
          aria-hidden="true"
        />

        <div
          className={cn("wheel-indicator", classNames.indicator)}
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
          data-wheel-indicator=""
          aria-hidden="true"
        />

        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className={cn("wheel-viewport", classNames.viewport)}
          style={{
            height: "100%",
            overflowY: disabled ? "hidden" : "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            ...styles.viewport,
          }}
          data-wheel-viewport=""
        >
          <div style={{ height: paddingHeight }} aria-hidden="true" />

          {displayItems.map((item, index) => {
            const realIndex = loop ? index % itemsLength : index;
            const isSelected = realIndex === internalValue;

            return (
              <button
                key={index}
                id={`${wheelId}-item-${index}`}
                ref={(el) => {
                  if (el) itemRefs.current.set(index, el);
                  else itemRefs.current.delete(index);
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-label={getLabel(item, realIndex)}
                disabled={disabled}
                onClick={() => handleItemClick(index)}
                className={cn(
                  "wheel-item",
                  classNames.item,
                  isSelected && classNames.selectedItem
                )}
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
                data-wheel-item=""
                data-selected={isSelected || undefined}
                data-index={realIndex}
                tabIndex={-1}
              >
                {render(item, realIndex, isSelected)}
              </button>
            );
          })}

          <div style={{ height: paddingHeight }} aria-hidden="true" />
        </div>
      </div>
    );
  }
) as <T>(
  props: WheelProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.JSX.Element;

(Wheel as { displayName?: string }).displayName = "Wheel";

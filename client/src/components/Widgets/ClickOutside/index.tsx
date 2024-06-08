import React, { useRef, useEffect } from "react";

interface IClickProps {
  children: JSX.Element | JSX.Element[];
  ignoreComponentRef?: React.MutableRefObject<null | HTMLElement>;
  className?: string;
  onClickOutside: (ev: MouseEvent) => void;
}

const ClickOutside = (props: IClickProps) => {
  const wrapperRef = useRef(null as null | HTMLDivElement);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !props.ignoreComponentRef?.current?.contains(event.target)
      ) {
        props.onClickOutside(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <span className={props.className} ref={wrapperRef}>
      {props.children}
    </span>
  );
};

export default ClickOutside;

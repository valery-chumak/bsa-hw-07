import { ChangeEvent, RefObject, useEffect, useState } from "react";

import { useComponentVisible } from "../../hooks/useComponentVisible";
import { BasicTitle } from "./styled/basic-title";
import { TitleContainer } from "./styled/title-container";
import { TitleInput } from "./styled/title-input";

type Props = {
  fontSize: "x-large" | "large" | "medium";
  isBold?: boolean;
  title: string;
  width?: number;
  onChange: (value: string, ref: RefObject<HTMLDivElement>) => void;
  onEnter: () => void;
};

export const Title = ({
  onChange,
  onEnter,
  title,
  fontSize,
  isBold,
  width,
}: Props) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [value, setValue] = useState(title);

  useEffect(() => setValue(title), [title]);

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value, ref);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
      setIsComponentVisible(false);
    }
  };

  return (
    <TitleContainer className="title-container" ref={ref}>
      {isComponentVisible ? (
        <TitleInput
          className="title-input"
          value={value}
          onChange={onEdit}
          onBlur={() => setIsComponentVisible(false)}
          onKeyDown={handleKeyDown}
          fontSize={fontSize}
          isBold={isBold}
          autoFocus={isComponentVisible}
          width={width ?? 250}
        />
      ) : (
        <BasicTitle
          className="title-content"
          onClick={() => setIsComponentVisible(true)}
        >
          {value}
        </BasicTitle>
      )}
    </TitleContainer>
  );
};

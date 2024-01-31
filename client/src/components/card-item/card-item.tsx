import type { DraggableProvided } from "@hello-pangea/dnd";

import { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { socket } from "../../context/socket";
import { CardEvent } from "../../common/enums";
import { useState } from "react";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleCopyCard = () => {
    socket.emit(CardEvent.DUPLICATE, card.id, listId);
  };

  const handleDeleteCard = () => {
    socket.emit(CardEvent.DELETE, card.id, listId);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleDescriptionSubmit = () => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, listId, card.id, description);
  };

  const handleTitleSubmit = () => {
    console.log("emit");
    socket.emit(CardEvent.RENAME, listId, card.id, title);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={handleTitleChange}
          onEnter={handleTitleSubmit}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text
          text={card.description}
          onChange={handleDescriptionChange}
          onEnter={handleDescriptionSubmit}
        />
        <Footer>
          <DeleteButton onClick={handleDeleteCard} />
          <Splitter />
          <CopyButton onClick={handleCopyCard} />
        </Footer>
      </Content>
    </Container>
  );
};

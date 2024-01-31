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

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
  const handleCopyCard = () => {
    socket.emit(CardEvent.DUPLICATE, card.id, listId);
  };

  const handleDeleteCard = () => {
    socket.emit(CardEvent.DELETE, card.id, listId);
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
        <Title onChange={() => {}} title={card.name} fontSize="large" isBold />
        <Text text={card.description} onChange={() => {}} />
        <Footer>
          <DeleteButton onClick={handleDeleteCard} />
          <Splitter />
          <CopyButton onClick={handleCopyCard} />
        </Footer>
      </Content>
    </Container>
  );
};

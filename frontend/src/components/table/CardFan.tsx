import { ArraySchema } from "@colyseus/schema"
import { GameContext } from "@contexts/Game"
import { DragEndEvent, useDndMonitor } from "@dnd-kit/core"
import CardInFan from "@table/CardInFan"
import type { CardDataClass } from "common"
import { MessageInit } from "common"
import React, { useContext } from "react"

type CardFanProps = {
  cards: ArraySchema<CardDataClass>
}

export default function CardFan({ cards }: CardFanProps) {
  const { room } = useContext(GameContext)

  useDndMonitor({
    onDragEnd(event: DragEndEvent) {
      if (event.collisions && event.collisions.length)
        room.send("game", {
          type: "playerPutCard",
          card: event.active.data.current
        } as MessageInit)
    }
  })

  return (
    <div className="fixed">
      {cards.map((card, index) => {
        return (
          <CardInFan
            key={index}
            card={card}
            index={index}
            cardsCount={cards.length}
          />
        )
      })}
    </div>
  )
}

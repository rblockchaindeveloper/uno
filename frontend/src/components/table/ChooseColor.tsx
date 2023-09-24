import { GameContext } from "@contexts/Game"
import { cardColorsCode } from "@utils/cardColorsCode"
import { cardColorsDefault, MessageInit } from "common"
import { useTranslations } from "next-intl"
import React, { useContext } from "react"

export default function ChooseColor() {
  const { room } = useContext(GameContext)

  const t = useTranslations("ChooseColor")

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex max-w-lg flex-col items-center gap-2 rounded-lg bg-[--secondary-background-color] p-4 opacity-95 shadow">
        <div className="p-3 text-center">
          <h3 className="text-xl font-medium text-[--text-color]">
            {t("text")}
          </h3>
        </div>
        <div className="mb-2 flex gap-2">
          {cardColorsDefault.map((color, index) => (
            <button
              key={index}
              type="button"
              className="w-16 rounded-full p-6"
              style={{ backgroundColor: cardColorsCode[color] }}
              onClick={() =>
                room.send("game", {
                  type: "playerChosenCardColor",
                  color
                } as MessageInit)
              }
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useContext, useEffect } from "react"
import { GameContext } from "@contexts/Game"
import Players from "@players/index"
import CardTable from "@table/index"
import { useBackButton, useInitData, usePopup } from "@twa.js/sdk-react"
import WaitingBanner from "@components/WaitingBanner"
import { PlayerDataClass } from "common"
import { Balance } from "@components/Balance"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export default function Game() {
  const t = useTranslations("Exit")

  const initData = useInitData()
  const { game } = useContext(GameContext)

  const router = useRouter()
  const popup = usePopup()
  const backButton = useBackButton()
  backButton.show()

  useEffect(() => {
    const back = () =>
      popup
        .open({
          message: t("message"),
          buttons: [
            {
              id: "yes",
              type: "destructive",
              text: t("yes")
            },
            {
              id: "no",
              type: "default",
              text: t("no")
            }
          ]
        })
        .then((event) => {
          if (event === "yes") {
            router.replace("/")

            localStorage.removeItem("lastGameReconnectionToken")
          }
        })

    backButton.on("click", back)

    return () => backButton.off("click", back)
  }, [])

  if (!Object.keys(game).length || initData === null || initData.user === null)
    return

  let thisPlayer = game.players.get(String(initData.user.id))
  if (!thisPlayer)
    thisPlayer = {
      info: game.visitors.get(String(initData.user.id)),
      playerState: null
    } as PlayerDataClass

  const participants = new Map<string, PlayerDataClass>(game.players)
  if (game.status !== "playing") {
    participants.clear()

    game.visitors.forEach((value, key) => {
      if (!participants.has(key)) {
        const player = new PlayerDataClass()
        player.info = value

        participants.set(key, player)
      }
    })

    game.players.forEach((value, key) => {
      participants.set(key, value)
    })
  }

  return (
    <div>
      <Balance bet={game.bet} />
      <Players
        players={participants}
        currentPlayer={game.currentPlayer}
        thisPlayer={thisPlayer}
      />
      {game.status === "playing" ? (
        <CardTable game={game} thisPlayer={thisPlayer} />
      ) : (
        <WaitingBanner player={thisPlayer} />
      )}
    </div>
  )
}

export type PostMsg = {
  type: "text"
  text: string
}

export type PostMsgV2 = {
  type: "textV2"
  text: string
  substitution: Record<string, PostMsgEmoji>
}

export type PostMsgEmoji = {
  type: "emoji"
  productId: string
  emojiId: string
}

export type PostMsgFlex = {
  type: "flex"
  altText: string
  contents: object
}

export type PostMsgPayload = {
  to: string
  messages: (PostMsg | PostMsgV2 | PostMsgFlex)[]
}

export async function postMsg(payload: PostMsgPayload) {
  return fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })
}

export async function postBroadcastMsg(payload: (PostMsg | PostMsgV2 | PostMsgFlex)[]) {
  return fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })
}

export type UserProfile = {
  userId: string
  displayName: string
  pictureUrl: string
  language: string
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(
    `https://api.line.me/v2/bot/profile/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      },
    },
  )

  return await res.json()
}

export async function getContent(contentId: string) {
  return fetch(
    `https://api-data.line.me/v2/bot/message/${contentId}/content`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      },
    },
  )
}

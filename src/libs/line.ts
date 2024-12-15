import { match } from "ts-pattern"

export type PostbackTypes = "reserveDate"

export type PostbackReserveDateParams = {
  date: string
}

export type Postback = {
  data: PostbackTypes
  params: PostbackReserveDateParams
}

export type DeliveryContext = {
  isRedelivery: boolean
}

export type Source = {
  type: string
  userId: string
}

export type WebhookEventType = "message" | "postback"
export type WebhookMessage = MessageText | MessageImage

export type MessageText = {
  type: "text"
  id: string
  quoteToken: string
  text: string
}

export type MessageImage = {
  type: "image"
  id: string
  quoteToken: string
  contentProvider: {
    type: string
  }
  imageSet?: {
    id: string
    index: number
    total: number
  }
}

export type WebhookEvent = {
  type: WebhookEventType
  message?: WebhookMessage
  postback?: Postback
  webhookEventId: string
  deliveryContext: DeliveryContext
  timestamp: number
  source: Source
  replyToken: string
  mode: string
}

export type WebhookPayload = {
  destination: string
  events: WebhookEvent[]
}

export type PayloadMessageText = {
  type: "text"
  text: string
}

export type PayloadReserve = {
  type: "reserve"
  date: string
}

export type PayloadImage = {
  type: "image"
  id: string
  imageSet?: PayloadImageSet
}

export type PayloadImageSet = {
  id: string
  index: number
  total: number
}

export type ParsePayload<T> = {
  userId: string
  content: T
}

export type ParsePayloadContent = PayloadReserve | PayloadMessageText | PayloadImage | null

export function parseLineEvent(event: WebhookEvent): ParsePayload<ParsePayloadContent> | null {
  const content = match(event)
    .with({ type: "postback" }, ({ postback }) => {
      if (!postback) return null
      return parsePostbackEvent(postback)
    })
    .with({ type: "message" }, ({ message }) => {
      if (!message) return null
      return parseMessageEvent(message)
    })
    .otherwise(() => null)

  return {
    userId: event.source.userId,
    content,
  }
}

function parseMessageEvent(input: WebhookMessage): PayloadMessageText | PayloadImage | null {
  return match(input)
    .with({ type: "text" }, ({ text }) => {
      return {
        type: "text",
        text,
      } as PayloadMessageText
    })
    .with({ type: "image" }, ({ id, imageSet }) => {
      return {
        type: "image",
        id,
        ...(imageSet && { imageSet }),
      } as PayloadImage
    })
    .otherwise(() => null)
}

function parsePostbackEvent(input: Postback): PayloadReserve | null {
  return match(input)
    .with({ data: "reserveDate" }, (postback) => {
      return {
        type: "reserve",
        date: postback.params.date,
      } as PayloadReserve
    })
    .otherwise(() => null)
}

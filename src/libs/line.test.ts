import {
  expect,
  test,
} from "vitest"
import {
  parseLineEvent,
  ParsePayload,
  PayloadImage,
  WebhookPayload,
} from "./line"

const INPUT_MESSAGE_MULTI_IMAGE: WebhookPayload[] = [
  {
    "destination": "U70c2168cda1cd8141003dadddcab87ea",
    "events": [
      {
        "type": "message",
        "message": {
          "type": "image",
          "id": "535883069103014193",
          "quoteToken":
            "SNGXwN8gc0PXURMvG4eeo4yIHzQ-jPbFWgtzPWT6gCrahmPp5f_cWSAU_T0axwrw0f4Q8y-xoy9HwIyfV11uONVlb-i68feyqkszqgnhALlEexU-IDYFo2QuxzqYUII1tc0L0S6ZAsWm4JQa3XDozA",
          "contentProvider": {
            "type": "line",
          },
          "imageSet": {
            "id": "7802AFDF403479ECAACD48570F80193117CCD42B4EE00E79902B84774C956DEC",
            "index": 1,
            "total": 2,
          },
        },
        "webhookEventId": "01JD8V5Z1CGDTFF7RWZH6SCS9A",
        "deliveryContext": {
          "isRedelivery": false,
        },
        "timestamp": 1732242504301,
        "source": {
          "type": "user",
          "userId": "U4c0ddc0072d446535d252964dee4886e",
        },
        "replyToken": "6ed8e6ad355c45acbb3a330b10d03040",
        "mode": "active",
      },
    ],
  },
  {
    "destination": "U70c2168cda1cd8141003dadddcab87ea",
    "events": [
      {
        "type": "message",
        "message": {
          "type": "image",
          "id": "535883069841473844",
          "quoteToken":
            "fw9gvSD4mnkrK0CTB1PD2uNEJrpyxj_O9Ci4ruf_-5FI537qHLW6HnBiO8u3aVsLIuN-7JWPejJmnYKLdimjTh9DUx81-JU18yU5-dJTMIYKCLR4ql5RXeTe2u5yaRpQCyJw4RQiZNP_Ky46R5-ypA",
          "contentProvider": {
            "type": "line",
          },
          "imageSet": {
            "id": "7802AFDF403479ECAACD48570F80193117CCD42B4EE00E79902B84774C956DEC",
            "index": 2,
            "total": 2,
          },
        },
        "webhookEventId": "01JD8V5ZAYXQGQ02RBW75V0C82",
        "deliveryContext": {
          "isRedelivery": false,
        },
        "timestamp": 1732242504959,
        "source": {
          "type": "user",
          "userId": "U4c0ddc0072d446535d252964dee4886e",
        },
        "replyToken": "a9d3c59d2bd448ff8779453769db326c",
        "mode": "active",
      },
    ],
  },
]

const INPUT_MESSAGE_SINGLE_IMAGE: WebhookPayload = {
  "destination": "U70c2168cda1cd8141003dadddcab87ea",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "image",
        "id": "535883055463137761",
        "quoteToken":
          "CJNer3ViK_dRAWofpfWKXQQxFFKmCQXAANnUpZ-4LSVqG0BMjx2U4Y-g6FW9DN3K5lRtk7r5mBYUM3RUatz--VJjZ2t-48Ie2ijJ9geWj4K5FGB_Afo_D5adhP_ZzEIW8K64jimosWKxUD2_NZ2Hwg",
        "contentProvider": {
          "type": "line",
        },
      },
      "webhookEventId": "01JD8V5PR4ZT47D4B93V6Q62K4",
      "deliveryContext": {
        "isRedelivery": false,
      },
      "timestamp": 1732242496018,
      "source": {
        "type": "user",
        "userId": "U4c0ddc0072d446535d252964dee4886e",
      },
      "replyToken": "fd489e0116904b9d85986351a2a280ad",
      "mode": "active",
    },
  ],
}

const INPUT_MESSAGE_TEXT: WebhookPayload = {
  "destination": "U70c2168cda1cd8141003dadddcab87ea",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "535883037008462181",
        "quoteToken":
          "kybSipJg3G0pCo47U9GrVPPi4LcP9rv_gdAFiCUlediSfUa5vQ7-BDVlPmfhgAPdzlLv2ZX1HTqwQMRNpQn5lMC3AgSVVGWd0e4S1QtnsNo3IjvO4PmYHLfQyy5WUM1P8gOGvdVekarM1YxG531wKA",
        "text": "Gaha",
      },
      "webhookEventId": "01JD8V5BQT9H3BAGC1A07F9H0F",
      "deliveryContext": {
        "isRedelivery": false,
      },
      "timestamp": 1732242484801,
      "source": {
        "type": "user",
        "userId": "U4c0ddc0072d446535d252964dee4886e",
      },
      "replyToken": "97d67de44f8640b19220f6b65fe8de83",
      "mode": "active",
    },
  ],
}

const INPUT_POSTBACK_RESERVATION: WebhookPayload = {
  "destination": "U70c2168cda1cd8141003dadddcab87ea",
  "events": [
    {
      "type": "postback",
      "postback": {
        "data": "reserveDate",
        "params": {
          "date": "2024-11-22",
        },
      },
      "webhookEventId": "01JD8V5741ZCFYNVX0AE5NHHCG",
      "deliveryContext": {
        "isRedelivery": false,
      },
      "timestamp": 1732242479769,
      "source": {
        "type": "user",
        "userId": "U4c0ddc0072d446535d252964dee4886e",
      },
      "replyToken": "ec3bf7a6784e4202ac05ea54db77f1ef",
      "mode": "active",
    },
  ],
}

test("parseLineMsg - postback", () => {
  const [ event ] = INPUT_POSTBACK_RESERVATION.events

  const payload = parseLineEvent(event)

  expect(payload).toStrictEqual({
    userId: "U4c0ddc0072d446535d252964dee4886e",
    content: {
      type: "reserve",
      date: "2024-11-22",
    },
  })
})

test("parseLineMsg - message text", () => {
  const [ event ] = INPUT_MESSAGE_TEXT.events

  const payload = parseLineEvent(event)

  expect(payload).toStrictEqual({
    userId: "U4c0ddc0072d446535d252964dee4886e",
    content: {
      type: "text",
      text: "Gaha",
    },
  })
})

test("parseLineMsg - single image", () => {
  const [ event ] = INPUT_MESSAGE_SINGLE_IMAGE.events

  const payload = parseLineEvent(event)

  expect(payload).toStrictEqual({
    userId: "U4c0ddc0072d446535d252964dee4886e",
    content: {
      type: "image",
      id: "535883055463137761",
    },
  })
})

test("parseLineMsg - multi image", () => {
  const actual: ParsePayload<PayloadImage>[] = [
    {
      userId: "U4c0ddc0072d446535d252964dee4886e",
      content: {
        type: "image",
        id: "535883069103014193",
        imageSet: {
          id: "7802AFDF403479ECAACD48570F80193117CCD42B4EE00E79902B84774C956DEC",
          index: 1,
          total: 2,
        },
      },
    },
    {
      userId: "U4c0ddc0072d446535d252964dee4886e",
      content: {
        type: "image",
        id: "535883069841473844",
        imageSet: {
          id: "7802AFDF403479ECAACD48570F80193117CCD42B4EE00E79902B84774C956DEC",
          index: 2,
          total: 2,
        },
      },
    },
  ]

  INPUT_MESSAGE_MULTI_IMAGE.forEach((input, i) => {
    const [ event ] = input.events
    const payload = parseLineEvent(event)

    expect(payload).toStrictEqual(actual[i])
  })
})

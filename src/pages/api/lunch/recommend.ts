// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

interface Lunch {
  title: string;
  price: number;
  distance: 1 | 2 | 3;
  description: string[];
  score: 1 | 2 | 3 | 4 | 5;
}

const mock: Lunch[] = [
  {
    title: 'JVL 부대찌개',
    price: 12000,
    distance: 2,
    description: ['부대찌개, 모듬사리 추가 가능합니다.'],
    score: 4,
  },
  {
    title: '오늘은닭',
    price: 16750,
    distance: 2,
    description: ['닭갈비를 다먹고 볶음밥을 시켜먹으면 이 또한 별미!'],
    score: 4,
  },
  {
    title: '초원족발',
    price: 9500,
    distance: 1,
    description: [
      '초원족발에서는 점심에 거의 순두부찌개를 먹죠!',
      '볶음김치, 햄치즈 등등 다양한 순두부찌개를 즐길 수 있습니다.',
    ],
    score: 4,
  },
  {
    title: '고본',
    price: 12000,
    distance: 1,
    description: ['돈까스 그냥 평범해요.'],
    score: 3,
  },
  {
    title: '골목찌개집',
    price: 12000,
    distance: 1,
    description: ['김치찌개, 제육볶음, 계란말이로 시키세요. 국룰 입니다.'],
    score: 4,
  },
  {
    title: '삼백플러스',
    price: 10000,
    distance: 1,
    description: [
      '한식백반인데 기다리지 않고 바로 먹을 수 있어요. 다만 최근에 오른 가격이 좀...',
    ],
    score: 3,
  },
  {
    title: '명가우육면',
    price: 11450,
    distance: 1,
    description: [
      'WMS파트의 한신님이 발굴한 맛집입니다. 고기를 우려낸 국수에 취향껏 고수를 추가해서 드셔보세요!',
    ],
    score: 5,
  },
  {
    title: '옥된장',
    price: 11000,
    distance: 2,
    description: ['주문할때 테이블의 QR코드를 이용해주세요!'],
    score: 4,
  },
  {
    title: '유리카모메',
    price: 13500,
    distance: 1,
    description: [
      '이 근방 최고의 일식 돈까스집이 아닐까요? 반박시 님말이 다 맞음',
    ],
    score: 5,
  },
  {
    title: '브라운돈까스',
    price: 10500,
    distance: 2,
    description: [
      '경양식 돈까스가 땡긴다면?',
      '전채로 빵과 딸기잼, 스프가 생각나는날.',
    ],
    score: 5,
  },
];

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { WebClient } = require('@slack/web-api');

  // Read a token from the environment variables
  try {
    const token = process.env.SLACK_TOKEN;

    // Initialize
    const web = new WebClient(token);
    const conversationId = process.env.SLACK_CONVERSATION_ID;
    console.log('conversationId', conversationId);
    const 오늘의추천메뉴 = mock[Math.floor(Math.random() * mock.length)];
    const distance = ['가까워요', '쪼오금 멀어요', '멀어요'][
      오늘의추천메뉴.distance - 1
    ];
    (async () => {
      // Post a message to the channel, and await the result.
      // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
      const result = await web.chat.postMessage({
        text: `오늘의 추천메뉴는 ${오늘의추천메뉴.title} 입니다.\n가격은 ${
          오늘의추천메뉴.price
        }원이며, 거리는 ${distance}.\n${오늘의추천메뉴.description.join('\n')}`,
        channel: conversationId,
      });

      // The result contains an identifier for the message, `ts`.
      console.log(
        `Successfully send message ${result.ts} in conversation ${conversationId}`
      );
    })();

    res
      .status(200)
      .send(
        `res : 오늘의 추천메뉴는 ${오늘의추천메뉴.title} 입니다.\n가격은 ${
          오늘의추천메뉴.price
        }원이며, 거리는 ${distance}.\n${오늘의추천메뉴.description.join('\n')}`
      );
  } catch (err) {
    console.log(err);
  }
}

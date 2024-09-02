// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WebClient } from '@slack/web-api';
import type { NextApiRequest, NextApiResponse } from 'next';
interface Lunch {
  title: string;
  price: number;
  distance: 1 | 2 | 3; //1=가까움, 3='멀다'
  description: string[];
  score: 1 | 2 | 3 | 4 | 5; //5점이 최고점
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
      'WMS파트의 한신님이 발굴한 맛집입니다. 고기를 우려낸 국물에 취향껏 고수를 추가해서 드셔보세요!',
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
      '전채로 빵과 딸기잼, 스프제공.',
      '스프는 또 달라고하면 또 줘요.',
    ],
    score: 5,
  },
];

let calledCount = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // Read a token from the environment variables
  try {
    console.log('호출', calledCount);
    calledCount++;
    const token = process.env.SLACK_TOKEN;
    console.log('token', token);
    console.log('body', req.body);

    // Initialize
    const web = new WebClient(token);
    const conversationId = req.body.channel_id;
    console.log('conversationId', conversationId);
    const 오늘의추천메뉴 = mock[Math.floor(Math.random() * mock.length)];
    const distance = ['가까워요', '쪼오금 멀어요', '멀어요'][
      오늘의추천메뉴.distance - 1
    ];
    const stars = '⭐️'.repeat(오늘의추천메뉴.score);
    const result = await web.chat.postMessage({
      text: `오늘의 추천메뉴는 ${오늘의추천메뉴.title} 입니다.\n가격은 ${
        오늘의추천메뉴.price
      }원이며, 거리는 ${distance}.\n${오늘의추천메뉴.description.join(
        '\n'
      )}\n${stars}`,
      channel: conversationId || '',
    });

    // The result contains an identifier for the message, `ts`.
    console.log(
      `Successfully send message ${result.ts} in conversation ${conversationId}`
    );
    const resMessage = [
      '점심 메뉴 추천이 필요하시군요???',
      '점심 천재가 자신있게 권해드립니다.',
      '점심값 깍는중...🤑',
      '나이르🍜🍜',
      `점심추천 비용으로 ${req.body.user_name}님의 월급 계좌에서 30,000원 출금 완료 했습니다. 이용해 주셔서 감사합니다.`,
      '점심 추천 API의 호출 제한으로 인해 오늘은 추천을 하지 않습니다만... 써비스 한번 드립니다.',
      '점심 추천 봇 관절에 기름칠 하는중...',
      '퍼플 카우 모집중...',
      '법인카드 광내는중 💳',
      '네트워크가 불안정합니다. 위성 인터넷으로 변경합니다.',
      '장비를 정지합니다.',
      '프로그램 오류로 인해 api 주소를 공개합니다. http://localhost:3000',
    ];
    res
      .status(200)
      .send(resMessage[Math.floor(Math.random() * resMessage.length)]);
  } catch (err) {
    console.log(err);
  }
}

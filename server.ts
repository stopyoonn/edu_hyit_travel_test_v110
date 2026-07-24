import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client server-side
  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  // 1. Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 2. Real-time Transit Data API
  app.get("/api/transit/live", (req, res) => {
    const origin = (req.query.origin as string) || "서울";
    const destination = (req.query.destination as string) || "부산";
    const travelDate = (req.query.date as string) || "10월 24일";
    
    // Simulate real-time price & status fluctuation based on current server minute
    const currentMinute = new Date().getMinutes();
    const priceVariance = (currentMinute % 5) * 2;
    const congestionStates = ["쾌적함", "보통", "혼잡", "매우 쾌적"];

    let options = [];

    const isDomesticKR = 
      (origin.includes("서울") || origin.includes("부산") || origin.includes("강릉") || origin.includes("대구") || origin.includes("대전") || origin.includes("광주") || origin.includes("제주")) ||
      (destination.includes("서울") || destination.includes("부산") || destination.includes("강릉") || destination.includes("대구") || destination.includes("대전") || destination.includes("광주") || destination.includes("제주"));

    if (isDomesticKR) {
      options = [
        {
          id: `tr-${Date.now()}-1`,
          type: "train",
          carrier: "Korail KTX",
          code: "KTX-101",
          departureTime: "08:15",
          arrivalTime: "10:50",
          duration: "2시간 35분",
          departureStation: `${origin.split(' ')[0]}역 (KTX)`,
          arrivalStation: `${destination.split(' ')[0]}역 (KTX)`,
          price: 59800 + (priceVariance * 1000),
          priceKrw: 59800 + (priceVariance * 1000),
          localPrice: 59800 + (priceVariance * 1000),
          localCurrency: "₩",
          currency: "₩",
          seatClass: "일반실 (Wi-Fi/전원)",
          tag: "최단시간",
          tagType: "primary",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: true,
          liveStatus: {
            delayMin: 0,
            statusText: "정시 운행 중",
            congestion: congestionStates[0],
            lastUpdated: "방금 전",
          },
        },
        {
          id: `tr-${Date.now()}-2`,
          type: "train",
          carrier: "SRT 고속철도",
          code: "SRT-312",
          departureTime: "11:00",
          arrivalTime: "13:22",
          duration: "2시간 22분",
          departureStation: `${origin.split(' ')[0]} 수서/중앙역`,
          arrivalStation: `${destination.split(' ')[0]}역`,
          price: 51800 + (priceVariance * 500),
          priceKrw: 51800 + (priceVariance * 500),
          localPrice: 51800 + (priceVariance * 500),
          localCurrency: "₩",
          currency: "₩",
          seatClass: "일반실",
          tag: "최저가",
          tagType: "secondary",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: false,
          liveStatus: {
            delayMin: 1,
            statusText: "1분 서행 운행",
            congestion: congestionStates[1],
            lastUpdated: "방금 전",
          },
        },
        {
          id: `tr-${Date.now()}-3`,
          type: "train",
          carrier: "KTX-산천 (특실)",
          code: "KTX-143",
          departureTime: "14:40",
          arrivalTime: "17:18",
          duration: "2시간 38분",
          departureStation: `${origin.split(' ')[0]}역`,
          arrivalStation: `${destination.split(' ')[0]}역`,
          price: 83700,
          priceKrw: 83700,
          localPrice: 83700,
          localCurrency: "₩",
          currency: "₩",
          seatClass: "특실 (무료 음료)",
          tag: "프리미엄",
          tagType: "outline",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: true,
          liveStatus: {
            delayMin: 0,
            statusText: "정시 운행 중",
            congestion: congestionStates[3],
            lastUpdated: "방금 전",
          },
        },
        {
          id: `fl-${Date.now()}-1`,
          type: "flight",
          carrier: "대한항공 / 아시아나",
          code: "KE-1105",
          departureTime: "09:30",
          arrivalTime: "10:35",
          duration: "1시간 05분",
          departureStation: `${origin.split(' ')[0]} 공항 (GMP)`,
          arrivalStation: `${destination.split(' ')[0]} 공항 (PUS/CJU)`,
          price: 92000 + (priceVariance * 2000),
          priceKrw: 92000 + (priceVariance * 2000),
          localPrice: 92000 + (priceVariance * 2000),
          localCurrency: "₩",
          currency: "₩",
          seatClass: "이코노미",
          tag: "항공 빠른속도",
          tagType: "outline",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: false,
          liveStatus: {
            delayMin: 0,
            statusText: "탑승 준비 중",
            congestion: congestionStates[1],
            lastUpdated: "1분 전",
          },
        },
        {
          id: `tx-${Date.now()}-1`,
          type: "taxi",
          carrier: "프라이빗 리무진 밴",
          code: "VAN-EXPRESS",
          departureTime: "원하는 시간 선택",
          arrivalTime: "약 4시간 소요",
          duration: "4시간 10분",
          departureStation: `${origin} 지정 픽업 장소`,
          arrivalStation: `${destination} 지정 하차 장소`,
          price: 320000,
          priceKrw: 320000,
          localPrice: 320000,
          localCurrency: "₩",
          currency: "₩",
          seatClass: "프리미엄 7인승 밴",
          tag: "도어투도어",
          tagType: "outline",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: true,
          liveStatus: {
            delayMin: 0,
            statusText: "즉시 배차 가능",
            congestion: congestionStates[0],
            lastUpdated: "방금 전",
          },
        }
      ];
    } else {
      // International routes with local currency and KRW conversion
      const isJapan = origin.includes("도쿄") || origin.includes("교토") || origin.includes("오사카") || destination.includes("도쿄") || destination.includes("교토") || destination.includes("오사카");
      const isEurope = origin.includes("런던") || origin.includes("파리") || origin.includes("로마") || destination.includes("런던") || destination.includes("파리") || destination.includes("로마");

      let locCurr = "$";
      let rate = 1380; // KRW per USD
      if (isJapan) {
        locCurr = "¥";
        rate = 9.0; // KRW per JPY
      } else if (isEurope) {
        locCurr = "€";
        rate = 1480; // KRW per EUR
      }

      const p1Local = isJapan ? 14200 : (isEurope ? 185.0 : 135.0);
      const p2Local = isJapan ? 9800 : (isEurope ? 92.0 : 75.0);
      const p3Local = isJapan ? 24000 : (isEurope ? 210.0 : 190.0);
      const p4Local = isJapan ? 52000 : (isEurope ? 480.0 : 420.0);

      options = [
        {
          id: `tr-${Date.now()}-1`,
          type: "train",
          carrier: isEurope ? "유로스타 / TGV" : (isJapan ? "신칸센 (Shinkansen)" : "Amtrak Express"),
          code: "EX-9024",
          departureTime: "08:00",
          arrivalTime: "10:20",
          duration: "2시간 20분",
          departureStation: `${origin} 중앙역`,
          arrivalStation: `${destination} 중앙역`,
          price: Math.round(p1Local * rate),
          priceKrw: Math.round(p1Local * rate),
          localPrice: p1Local,
          localCurrency: locCurr,
          currency: "₩",
          seatClass: "Standard / 일반석",
          tag: "최단시간",
          tagType: "primary",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: true,
          liveStatus: {
            delayMin: 0,
            statusText: "정시 운행 중",
            congestion: congestionStates[0],
            lastUpdated: "방금 전",
          },
        },
        {
          id: `tr-${Date.now()}-2`,
          type: "train",
          carrier: isEurope ? "Regional Express" : (isJapan ? "JR Rapid Rail" : "Regional Commuter"),
          code: "CR-104",
          departureTime: "12:30",
          arrivalTime: "15:00",
          duration: "2시간 30분",
          departureStation: `${origin} 메인역`,
          arrivalStation: `${destination} 메인역`,
          price: Math.round(p2Local * rate),
          priceKrw: Math.round(p2Local * rate),
          localPrice: p2Local,
          localCurrency: locCurr,
          currency: "₩",
          seatClass: "Economy",
          tag: "최저가",
          tagType: "secondary",
          direct: true,
          refundable: false,
          wifi: true,
          quietCar: false,
          liveStatus: {
            delayMin: 2,
            statusText: "2분 지연",
            congestion: congestionStates[1],
            lastUpdated: "1분 전",
          },
        },
        {
          id: `fl-${Date.now()}-1`,
          type: "flight",
          carrier: "국제선 대표 항공사",
          code: "FL-302",
          departureTime: "09:40",
          arrivalTime: "11:10",
          duration: "1시간 30분",
          departureStation: `${origin} 공항`,
          arrivalStation: `${destination} 공항`,
          price: Math.round(p3Local * rate),
          priceKrw: Math.round(p3Local * rate),
          localPrice: p3Local,
          localCurrency: locCurr,
          currency: "₩",
          seatClass: "이코노미",
          tag: "항공 직항",
          tagType: "outline",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: false,
          liveStatus: {
            delayMin: 0,
            statusText: "정시 수속 중",
            congestion: congestionStates[1],
            lastUpdated: "방금 전",
          },
        },
        {
          id: `tx-${Date.now()}-1`,
          type: "taxi",
          carrier: "프라이빗 공항 / 도시간 트랜스퍼",
          code: "VIP-TRANS",
          departureTime: "상시 가능",
          arrivalTime: "목적지 직행",
          duration: "3시간 30분",
          departureStation: `${origin} (Pick-up)`,
          arrivalStation: `${destination} (Drop-off)`,
          price: Math.round(p4Local * rate),
          priceKrw: Math.round(p4Local * rate),
          localPrice: p4Local,
          localCurrency: locCurr,
          currency: "₩",
          seatClass: "Luxury Sedan / Van",
          tag: "프라이빗",
          tagType: "outline",
          direct: true,
          refundable: true,
          wifi: true,
          quietCar: true,
          liveStatus: {
            delayMin: 0,
            statusText: "즉시 배차 가능",
            congestion: congestionStates[0],
            lastUpdated: "방금 전",
          },
        }
      ];
    }

    res.json({
      origin,
      destination,
      passengerCount: 1,
      travelDate,
      lastPriceUpdate: "실시간 노선 및 가격 정보 업데이트됨",
      options,
    });
  });

  // 3. Transit Filter & Search Route
  app.post("/api/transit/search", (req, res) => {
    const { mode, maxPrice, preferences, origin, destination } = req.body;
    
    let baseList = [
      {
        id: "search-1",
        type: "train",
        carrier: "유로스타 • ES9024",
        departureTime: "08:01",
        arrivalTime: "11:17",
        departureStation: `${origin || "런던"} 세인트 판크라스`,
        arrivalStation: `${destination || "파리"} 북역`,
        duration: "2시간 16분",
        price: 214,
        seatClass: "스탠다드 프리미어",
        tag: "최단시간",
        direct: true,
        refundable: true,
        wifi: true,
        quietCar: true,
        liveStatus: "실시간 좌석 잔여 4석",
      },
      {
        id: "search-2",
        type: "train",
        carrier: "유로스타 • ES9032",
        departureTime: "13:31",
        arrivalTime: "16:47",
        departureStation: `${origin || "런던"} 세인트 판크라스`,
        arrivalStation: `${destination || "파리"} 북역`,
        duration: "2시간 16분",
        price: 89,
        seatClass: "일반석",
        tag: "최저가",
        direct: true,
        refundable: false,
        wifi: true,
        quietCar: false,
        liveStatus: "실시간 가격 5% 할인 적용",
      },
      {
        id: "search-3",
        type: "flight",
        carrier: "에어프랑스 • AF1681",
        departureTime: "11:05",
        arrivalTime: "13:20",
        departureStation: `${origin || "런던"} 히드로`,
        arrivalStation: `${destination || "파리"} CDG`,
        duration: "1시간 15분",
        price: 175,
        seatClass: "비즈니스 클래스",
        tag: "직항",
        direct: true,
        refundable: true,
        wifi: true,
        quietCar: false,
        liveStatus: "실시간 탑승구 확정 (Gate A12)",
      },
      {
        id: "search-4",
        type: "taxi",
        carrier: "Voyager 프라이빗 리무진",
        departureTime: "요청 시 즉시 출발",
        arrivalTime: "목적지 바로 도착",
        departureStation: `${origin || "출발지"} 전역`,
        arrivalStation: `${destination || "도착지"} 전역`,
        duration: "약 4시간 30분",
        price: 520,
        seatClass: "세단 VIP",
        tag: "프라이빗",
        direct: true,
        refundable: true,
        wifi: true,
        quietCar: true,
        liveStatus: "실시간 운전기사 대기 중",
      },
    ];

    if (mode && mode !== "all") {
      baseList = baseList.filter((item) => item.type === mode);
    }
    if (maxPrice) {
      baseList = baseList.filter((item) => item.price <= maxPrice);
    }

    res.json({
      success: true,
      count: baseList.length,
      results: baseList,
      timestamp: new Date().toLocaleTimeString("ko-KR"),
    });
  });

  // 4. Gemini AI Real-time Itinerary & Traffic Planning API
  app.post("/api/itinerary/generate", async (req, res) => {
    try {
      const { origin, destination, startDate, endDate, preferences } = req.body;
      const themeText = preferences && preferences.length ? preferences.join(", ") : "역사, 예술, 자연";

      if (!ai) {
        // Fallback default AI itinerary if key not provided
        return res.json({
          title: `1일차 일정: ${destination || "서울"} ${themeText.split(",")[0]} 탐방`,
          themeScore: 95,
          optimized: true,
          insight: `선택하신 ${themeText} 테마에 맞춰 ${origin || "현재 위치"}에서 ${destination || "목적지"}까지 최적화된 동선입니다. 도보와 실시간 대중교통 이용을 고려하여 쾌적한 이동이 가능하도록 설계되었습니다.`,
          stops: [
            {
              order: "01",
              arrivalTime: "09:30",
              name: destination === "경복궁" ? "경복궁 근정전" : "경복궁",
              durationEstimate: "2시간 소요 예정",
              imageUrl:
                "https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1200&auto=format&fit=crop",
              quote: "한국 전통 건축의 웅장함과 고즈넉한 정취를 경험할 수 있는 최고의 출발점입니다.",
              transitStatus: {
                mode: "walk",
                statusText: "교통 상태: 쾌적함 (도보 15분)",
                congestionLevel: 1,
              },
            },
            {
              order: "02",
              arrivalTime: "12:00",
              name: "북촌 한옥마을",
              durationEstimate: "1.5시간 소요 예정",
              imageUrl:
                "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200&auto=format&fit=crop",
              quote: "전통 가옥 사이로 보이는 현대적인 도시 스카이라인이 매력적인 포인트입니다.",
              transitStatus: {
                mode: "transit",
                statusText: "교통 상태: 원활 (마을버스 5분)",
                congestionLevel: 1,
              },
            },
            {
              order: "03",
              arrivalTime: "14:30",
              name: "국립현대미술관 서울",
              durationEstimate: "2시간 소요 예정",
              imageUrl:
                "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop",
              quote: "역사적인 정취 속에 자리잡은 현대 미술의 정수를 감상할 수 있는 공간입니다.",
              transitStatus: {
                mode: "walk",
                statusText: "교통 상태: 쾌적함 (도보 8분)",
                congestionLevel: 1,
              },
            },
          ],
        });
      }

      // Call Gemini API server-side
      const prompt = `당신은 프리미엄 모노크롬 여행 컨시어지 'VOYAGER'의 여행 AI 실시간 경로 설계 엔진입니다.
다음 조건으로 여행 일정 및 실시간 교통 상태를 추천해 주세요.
- 출발지: ${origin || "현재 위치"}
- 도착지: ${destination || "서울"}
- 일자: ${startDate || "10월 14일"} ~ ${endDate || "10월 17일"}
- 여행 취향/테마: ${themeText}

반드시 JSON 형식으로 출력해 주세요. JSON 스키마는 다음과 같습니다:
{
  "title": "1일차 일정: [테마 이름]",
  "themeScore": 95,
  "optimized": true,
  "insight": "이 일정을 추천하는 정교한 이유 2~3문장",
  "stops": [
    {
      "order": "01",
      "arrivalTime": "09:30",
      "name": "장소 이름",
      "durationEstimate": "2시간 소요 예정",
      "imageUrl": "대표 사진 hotlink URL (Unsplash 등)",
      "quote": "장소의 매력을 담은 한 줄 코멘트",
      "transitStatus": {
        "mode": "walk" 또는 "transit",
        "statusText": "교통 상태: 쾌적함 (도보 15분)",
        "congestionLevel": 1
      }
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              themeScore: { type: Type.NUMBER },
              optimized: { type: Type.BOOLEAN },
              insight: { type: Type.STRING },
              stops: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    order: { type: Type.STRING },
                    arrivalTime: { type: Type.STRING },
                    name: { type: Type.STRING },
                    durationEstimate: { type: Type.STRING },
                    imageUrl: { type: Type.STRING },
                    quote: { type: Type.STRING },
                    transitStatus: {
                      type: Type.OBJECT,
                      properties: {
                        mode: { type: Type.STRING },
                        statusText: { type: Type.STRING },
                        congestionLevel: { type: Type.NUMBER },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Itinerary API Error:", err);
      res.status(500).json({ error: "Gemini AI generation error", message: err.message });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Voyager Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

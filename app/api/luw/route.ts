export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const { prompt, imageUrl } = await req.json()

  const API_URL = "https://api.luw.ai/v2/generate"
  const API_TOKEN = process.env.LUW_API_TOKEN

  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  }

  if (!prompt || prompt.trim().length === 0) {
    return new Response("プロンプトが未入力です", { status: 400 })
  }

  if (!imageUrl?.startsWith("http")) {
    return new Response("画像URLが不正です", { status: 400 })
  }
  

  const payload = JSON.stringify({
    model: "interior",
    prompt,
    image: imageUrl,
    fill_room: "true",
    precise: 5,
    enhance_prompt: "false"
  })

  const initRes = await fetch(API_URL, {
    method: "POST",
    headers,
    body: payload,
  })

  if (!initRes.ok) {
    const text = await initRes.text()
    return new Response(`初回リクエスト失敗: ${initRes.status} - ${text}`, { status: 500 })
  }

  const initData = await initRes.json()
  const processing_url = initData.processing_url

  if (!processing_url) {
    return new Response("processing_url が取得できませんでした", { status: 500 })
  }

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const pollRes = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "interior",
        processing_url,
      }),
    })

    if (!pollRes.ok) continue

    const pollData = await pollRes.json()

    if (pollData.status && !pollData.processing) {
      const imageUrl = pollData.output
      return Response.json({ imageUrl })
    }
  }

  return new Response("画像生成がタイムアウトしました", { status: 504 })
}

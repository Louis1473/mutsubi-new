"use client"

import type React from "react"
import { useState } from "react"
import { TextField, Button } from "@mui/material"
import Image from "next/image"
import { uploadFileToFirebase } from "@/utils/uploadToFirebase" // ← 追加

export default function Page() {
  const [roomImage, setRoomImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null) 
  const [btn, setBtn] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setRoomImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!file || !prompt) {
      console.error("⚠️ ファイルまたはプロンプトが未設定")
      return
    }

    setBtn(true)

    try {
      // FirebaseにアップロードしてURL取得
      const firebaseUrl = await uploadFileToFirebase(file)
      console.log("✅ Firebase URL:", firebaseUrl)

      if (!firebaseUrl.startsWith("http")) {
        console.error("❌ URL形式が不正！", firebaseUrl)
      }
      

      // LUW API呼び出し
      const res = await fetch("/api/luw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrl: firebaseUrl,
        }),
      })

      if (!res.ok) {
        let errorText = ""
        try {
          errorText = await res.text()
        } catch {
          errorText = "レスポンス本文の取得に失敗"
        }
        console.error("❌ エラー:", res.status, errorText)
        return
      }

      const { imageUrl } = await res.json()
      console.log("🎨 LUW生成画像:", imageUrl)
      setResultImage(imageUrl)
    } catch (err) {
      console.error("🔥 アップロード or APIエラー", err)
    } finally{
      setBtn(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-amber-500 mb-8">Kiei</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-red rounded-lg p-6 flex flex-col">
          <h2 className="text-xl mb-4">部屋の画像</h2>

          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mb-4 min-h-[400px]">
            {roomImage ? (
              <img src={roomImage} alt="部屋の画像" className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <div className="text-center p-4">
                <label htmlFor="room-image-upload" className="cursor-pointer">
                  <div className="border border-gray-400 rounded px-4 py-2 inline-block hover:bg-gray-50">
                    ファイルを選択してください
                  </div>
                  <input
                    id="room-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="mt-4">
            <TextField
              label="プロンプト"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="部屋の説明を入力してください"
            />
          </div>
        </div>

        <div className="border border-red-300 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl mb-4">結果</h2>

          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg min-h-[400px]">
            {resultImage ? (
              <Image
                src={resultImage}
                alt="結果画像"
                width={400}
                height={400}
                className="max-w-full max-h-[400px] object-contain"
              />
            ) : (
              <p className="text-gray-500">生成の結果はこちら</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="contained"
          sx={{
            bgcolor: "#F6C744",
            "&:hover": { bgcolor: "#E5B73B" },
            px: 4,
            py: 1,
          }}
          onClick={handleSubmit}
          disabled={btn}
        >
          {btn ? "生成中..." : "生成実行"}
        </Button>
      </div>
    </main>
  )
}

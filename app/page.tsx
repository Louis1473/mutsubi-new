"use client"

import type React from "react"

import { useState } from "react"
import { TextField, Button } from "@mui/material"
import Image from "next/image"

export default function Page() {
  const [roomImage, setRoomImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setRoomImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    // ここで実際の処理を行います
    // デモ用に仮の結果画像を設定
    setResultImage("/placeholder.svg?height=400&width=400")
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-amber-500 mb-8">Kiei</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左側: 部屋の画像とプロンプト */}
        <div className="border border-red rounded-lg p-6 flex flex-col">
          <h2 className="text-xl mb-4">部屋の画像</h2>

          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mb-4 min-h-[400px]">
            {roomImage ? (
              <img
                src={roomImage || "/placeholder.svg"}
                alt="部屋の画像"
                className="max-w-full max-h-[400px] object-contain"
              />
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

        {/* 右側: 結果の画像 */}
        <div className="border border-red-300 rounded-lg p-6 flex flex-col">
          <h2 className="text-xl mb-4">結果</h2>

          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg min-h-[400px]">
            {resultImage ? (
              <Image
                src={resultImage || "/placeholder.svg"}
                alt="結果画像"
                width={400}
                height={400}
                className="max-w-full max-h-[400px] object-contain"
              />
            ) : (
              <p className="text-gray-500">試着の結果はこちら</p>
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
        >
          試着実行
        </Button>
      </div>
    </main>
  )
}
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export async function uploadFileToFirebase(file: File): Promise<string> {
  const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  return url
}

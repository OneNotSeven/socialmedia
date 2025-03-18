import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface UploadResponse {
  success: boolean;
  message: string;
  progress?: number;
}

export const handleUpload = (file: File | null): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve({ success: false, message: "Please select a file!" });
    }

    const fileRef = ref(storage, `socialvideos/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        
        
        
      },
      (error) => {
        console.error("Upload failed:", error);
        reject({ success: false, message: "Upload failed!" });
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ success: true, message: url });
        } catch (error) {
          console.error("Error getting URL:", error);
          reject({ success: false, message: "Failed to get download URL!" });
        }
      }
    );
  });
};

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadFile(file) {
    if (!file) return null;

    // unique path
    const storageRef = ref(storage, `Notes/${Date.now()}-${file.name}`);

    // upload
    const snapshot = await uploadBytes(storageRef, file);

    // get public URL
    const url = await getDownloadURL(snapshot.ref);
    return url;
}

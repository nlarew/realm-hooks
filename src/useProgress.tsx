import * as React from "react"
import * as Realm from "realm"
import type { ProgressNotificationCallback, ProgressDirection, ProgressMode } from "realm"
import { useRealmWithContextFallback } from "./useRealm"

type Progress = {
  transferred: number
  transferable: number
}

type UseUploadProgressResult = {
  isUploading: boolean
  uploadProgress: Progress
}
type UseDownloadProgressResult = {
  isDownloading: boolean
  downloadProgress: Progress
}
interface UseProgressResult {
  loading: boolean
  progress: Progress
}

interface UseProgressConfig {
  realm?: Realm
  mode?: ProgressMode
  direction: ProgressDirection
  onProgress?: ProgressNotificationCallback
}

export default function useProgress({
  realm,
  direction,
  onProgress,
  mode = "reportIndefinitely"
}: UseProgressConfig): UseProgressResult {
  const progressRealm = useRealmWithContextFallback(realm)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [progress, setProgress] = React.useState<Progress>({
    transferred: 0,
    transferable: 0
  })
  React.useEffect(() => {
    if (progressRealm.syncSession) {
      const handleNotification: ProgressNotificationCallback = (transferred, transferable) => {
        setLoading(transferred < transferable)
        setProgress({ transferred, transferable })
        if (onProgress) {
          onProgress(transferred, transferable)
        }
      }
      progressRealm.syncSession.addProgressNotification(direction, mode, handleNotification)
      return () => progressRealm.syncSession?.removeProgressNotification(handleNotification)
    }
    return
  }, [progressRealm, progressRealm.syncSession, direction])

  return { progress, loading }
}

interface UseUploadProgressConfig {
  realm?: Realm
  mode?: ProgressMode
  onUploadProgress?: ProgressNotificationCallback
}
export function useUploadProgress({
  realm,
  mode = "reportIndefinitely",
  onUploadProgress
}: UseUploadProgressConfig = {}): UseUploadProgressResult {
  const { progress: uploadProgress, loading: isUploading } = useProgress({
    realm,
    mode,
    direction: "download",
    onProgress: onUploadProgress
  })
  return { uploadProgress, isUploading }
}

interface UseDownloadProgressConfig {
  realm?: Realm
  mode?: ProgressMode
  onDownloadProgress?: ProgressNotificationCallback
}
export function useDownloadProgress({
  realm,
  mode = "reportIndefinitely",
  onDownloadProgress
}: UseDownloadProgressConfig = {}): UseDownloadProgressResult {
  const { progress: downloadProgress, loading: isDownloading } = useProgress({
    realm,
    mode,
    direction: "download",
    onProgress: onDownloadProgress
  })
  return { downloadProgress, isDownloading }
}

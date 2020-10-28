// Should we split into multiple hooks?
// - useProgress({ onDownload, onUpload })
// - useUploadProgress(onUpload)
// - useDownloadProgress(onDownload)

import * as React from "react"
import * as Realm from "realm"
import type { ProgressNotificationCallback, ProgressDirection, ProgressMode } from "realm"
import useRealm, { useRealmWithContextFallback } from "./useRealm"

interface UseProgressConfig {
  realm?: Realm;
  onProgress?: ProgressNotificationCallback;
  onUpload?: ProgressNotificationCallback;
  onDownload?: ProgressNotificationCallback;
  mode?: ProgressMode
}

function useDownloadProgress({ realm, onDownload }: UseProgressConfig): DownloadProgress {
  const { download } = useProgress({ realm, direction: "download", mode: "reportIndefinitely", onDownload })
  return {
    direction: "download",

  }
}

function useUploadProgress({ realm, onUpload }: UseProgressConfig): UploadProgress {

}

type Progress = {
  direction: ProgressDirection
  transferred: number
  transferable: number
}
type DownloadProgress = Progress & { direction: "download" }
type UploadProgress = Progress & { direction: "upload" }

interface UseProgress extends UseProgressConfig {
  direction: ProgressDirection
}

export default function useProgress({
  realm,
  direction,
  onProgress,
  onUpload,
  onDownload,
  mode = "reportIndefinitely"
}: UseProgress): Progress {
  const progressRealm = useRealmWithContextFallback(realm)
  const [progress, setProgress] = React.useState<Progress>({
    direction,
    transferred: 0,
    transferable: 0
  })
  React.useEffect(() => {
    if (progressRealm.syncSession) {
      const handleNotification: ProgressNotificationCallback = (transferred, transferable) => {
        setProgress({ ...progress, transferred, transferable })
        if (onProgress) {
          onProgress(transferred, transferable)
        }
      }
      progressRealm.syncSession.addProgressNotification(direction, mode, handleNotification)
      return () => progressRealm.syncSession?.removeProgressNotification(handleNotification)
    }
    return
  }, [progressRealm, progressRealm.syncSession, direction])

  return progress
}

// const projectRealm = {} as Realm
// // Simple return object that represents current progress as state
// const progress: Progress = useProgress({ direction: "download" });
// // Fully reactive call that showcases maximum option specificity
// useProgress({
//   realm: projectRealm,
//   direction: "download",
//   mode: "forCurrentlyOutstandingWork",
//   onProgress: (transferred, transferable) => {
//     const completionPercentage = (transferred / transferable) * 100
//     console.log(`Download is ${completionPercentage}% complete.`)
//   }
// })
// // Fully reactive call with minimal option specificity
// useProgress({
//   direction: "download",
//   onProgress: (transferred, transferable) => {
//     const completionPercentage = (transferred / transferable) * 100
//     console.log(`Download is ${completionPercentage}% complete.`)
//   }
// })

// interface UseProgressConfig {
//   direction: ProgressDirection,
//   onProgress?: ProgressNotificationCallback,
//   mode?: ProgressMode
// }
// interface UseProgressNext {
//   (realm: Realm, config: UseProgressConfig): Progress;
//   (config: UseProgressConfig): Progress;
// }
// interface UseProgressNextCombined {
//   (realmOrConfig: Realm | UseProgressConfig, config?: UseProgressConfig): Progress;
// }
// const explicit: UseProgressNext = (realm: Realm, { direction, onProgress, mode="reportIndefinitely" }: UseProgressConfig) => {
//   console.log(realm, direction, onProgress, mode)
//   return { direction, transferred: 0, transferable: 0 }
// }
// const implicit: UseProgressNext = ({ direction, onProgress, mode="reportIndefinitely" }: UseProgressConfig) => {
//   const realm = useRealm();
//   console.log(realm, direction, onProgress, mode)
//   return { direction, transferred: 0, transferable: 0 }
// }

// explicit(projectRealm, {
//   direction: "upload",
//   onProgress: (transferred, transferable) => {}
// })
// implicit({
//   direction: "upload",
//   onProgress: (transferred, transferable) => {}
// })

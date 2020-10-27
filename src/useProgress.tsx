// Should we split into multiple hooks?
// - useProgress({ onDownload, onUpload })
// - useUploadProgress(onUpload)
// - useDownloadProgress(onDownload)

import * as React from 'react'
import * as Realm from 'realm'
import useRealm from './useRealm';



type ProgressNotificationCallback = (transferred: number, transferable: number) => void;
type ProgressDirection = 'download' | 'upload';
type ProgressMode = 'reportIndefinitely' | 'forCurrentlyOutstandingWork';

type Progress = {
  direction: ProgressDirection;
  transferred: number;
  transferable: number;
}

interface UseProgress {
  realm?: Realm,
  direction: ProgressDirection,
  onProgress?: ProgressNotificationCallback,
  mode?: ProgressMode
}
function useRealmWithContextFallback(r: Realm | undefined): Realm {
  const contextRealm = useRealm();
  return r ?? contextRealm;
}

export default function useProgress({ realm, direction, onProgress, mode="reportIndefinitely" }: UseProgress): Progress {
  const progressRealm = useRealmWithContextFallback(realm);
  const [progress, setProgress] = React.useState<Progress>({ direction, transferred: 0, transferable: 0 });
  React.useEffect(() => {
    if(progressRealm.syncSession) {
      const handleNotification: ProgressNotificationCallback = (transferred, transferable) => {
        setProgress({ ...progress, transferred, transferable });
        if(onProgress) {
          onProgress(transferred, transferable);
        }
      }
      progressRealm.syncSession.addProgressNotification(direction, mode, handleNotification);
      return () => progressRealm.syncSession?.removeProgressNotification(handleNotification);
    }
    return
  }, [progressRealm, progressRealm.syncSession, direction])
  
  return progress;
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

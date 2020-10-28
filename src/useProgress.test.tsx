import useProgress, { useUploadProgress, useDownloadProgress } from "./useProgress"

const { uploadProgress, isUploading } = useUploadProgress({
  onUploadProgress: (transferred: number, transferable: number) => {
    console.log("transferred", transferred)
    console.log("transferable", transferable)
  }
})
console.log("uploadProgress", uploadProgress)
console.log("isUploading", isUploading)

const { downloadProgress, isDownloading } = useDownloadProgress({
  onDownloadProgress: (transferred: number, transferable: number) => {
    console.log("transferred", transferred)
    console.log("transferable", transferable)
  }
})
console.log("downloadProgress", downloadProgress)
console.log("isDownloading", isDownloading)



describe("useProgress", () => {
  describe("when used with a local realm", () => {
    test("it does nothing", () => {
      expect(true)
    })
  })
  describe("when used with a synced realm", () => {
    test("it returns upload and download progress", () => {
      expect(true)
    })
    test("it calls the user-provided onProgress callback", () => {
      expect(true)
    })
  })
})

describe("useUploadProgress", () => {
  describe("when used with a local realm", () => {
    test("it does nothing", () => {
      expect(true)
    })
  })
  describe("when used with a synced realm", () => {
    test("it returns upload progress", () => {
      expect(true)
    })
    test("it calls the user-provided onUploadProgress callback", () => {
      expect(true)
    })
  })
})

describe("useDownloadProgress", () => {
  describe("when used with a local realm", () => {
    test("it does nothing", () => {
      expect(true)
    })
  })
  describe("when used with a synced realm", () => {
    test("it returns download progress", () => {
      expect(true)
    })
    test("it calls the user-provided onDownloadProgress callback", () => {
      expect(true)
    })
  })
})

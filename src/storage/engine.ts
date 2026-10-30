type EngineStoreParams = {
  directory: string
}

export class EngineStore {
  private params: EngineStoreParams
  private storage: StorageManager

  constructor(params: EngineStoreParams) {
    this.storage = navigator.storage

    this.params = params
  }

  private async getFolder(): Promise<FileSystemDirectoryHandle> {
    const root = await this.storage.getDirectory()

    const folder = await root.getDirectoryHandle(this.params.directory, {
      create: true,
    })

    return folder
  }

  /**
   * @description
   * Reads a current image saved.
   * @param filename - Filename to get.
   */
  public async read(filename: string): Promise<File> {
    const folder = await this.getFolder()

    const handle = await folder.getFileHandle(filename)

    return handle.getFile()
  }

  /**
   * @description
   * Save an image on the browser.
   * @param file - file to create.
   * @param uuid - uuid of resource.
   */
  public async save(file: File, uuid: string): Promise<void> {
    const folder = await this.getFolder()
    const filename = `${uuid}-${file.name}`
    const resource = await folder.getFileHandle(filename, { create: true })
    const writable = await resource.createWritable()

    await writable.write(file)
    await writable.close()
  }

  /**
   * @description
   *
   */
  public async preload(): Promise<File[]> {
    const folder = await this.getFolder()

    const resolver: File[] = []

    for await (const [, entry] of folder.entries()) {
      if (entry.kind === 'file') {
        resolver.push(await entry.getFile())
      }
    }

    return resolver
  }

  /**
   * Removes this engine's directory and all of its contents.
   */
  public async deleteStorage(): Promise<void> {
    const root = await this.storage.getDirectory()

    await root.removeEntry(this.params.directory, { recursive: true })
  }
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EngineStore } from '@/storage/engine'

describe('engine storage actions', () => {
  const file = new File(['image'], 'photo.png', { type: 'image/png' })
  const writable = {
    write: vi.fn(),
    close: vi.fn(),
  }
  const fileHandle = {
    kind: 'file',
    getFile: vi.fn().mockResolvedValue(file),
    createWritable: vi.fn().mockResolvedValue(writable),
  } as unknown as FileSystemFileHandle
  const childDirectory = { kind: 'directory' } as FileSystemDirectoryHandle

  let directory: FileSystemDirectoryHandle
  let root: Pick<FileSystemDirectoryHandle, 'getDirectoryHandle' | 'removeEntry'>

  beforeEach(() => {
    directory = {
      getFileHandle: vi.fn().mockResolvedValue(fileHandle),
      entries: vi.fn(async function* () {
        yield ['photo.png', fileHandle]
        yield ['nested', childDirectory]
      }),
    } as unknown as FileSystemDirectoryHandle

    root = {
      getDirectoryHandle: vi.fn().mockResolvedValue(directory),
      removeEntry: vi.fn(),
    }

    vi.stubGlobal('navigator', {
      storage: { getDirectory: vi.fn().mockResolvedValue(root) },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('reads and saves files in its directory', async () => {
    const storage = new EngineStore({ directory: 'lume' })

    await expect(storage.read('photo.png')).resolves.toBe(file)
    await storage.save(file, 'image-id')

    expect(directory.getFileHandle).toHaveBeenNthCalledWith(1, 'photo.png')
    expect(directory.getFileHandle).toHaveBeenNthCalledWith(2, 'image-id-photo.png', {
      create: true,
    })
    expect(writable.write).toHaveBeenCalledWith(file)
    expect(writable.close).toHaveBeenCalledOnce()
  })

  it('preloads files and ignores nested directories', async () => {
    const storage = new EngineStore({ directory: 'lume' })

    await expect(storage.preload()).resolves.toEqual([file])
  })

  it('deletes its directory recursively', async () => {
    const storage = new EngineStore({ directory: 'lume' })

    await storage.deleteStorage()

    expect(root.removeEntry).toHaveBeenCalledWith('lume', { recursive: true })
  })
})

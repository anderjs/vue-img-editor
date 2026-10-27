type IConfig = Readonly<{
  MAX_FILE_SIZE: number
}>

const config: IConfig = {
  MAX_FILE_SIZE: 1_048_600_00,
}

export default config

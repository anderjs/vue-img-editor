type IConfig = Readonly<{
  MAX_FILE_SIZE: number;
}>;

const config: IConfig = {
  MAX_FILE_SIZE: 1_000_000_000
}

export default config;

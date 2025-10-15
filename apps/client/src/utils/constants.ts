export const ENDPOINT = import.meta.env.VITE_ENDPOINT ?? 'http://localhost:4000'

export const SOCKET_ENDPOINT =
  import.meta.env.VITE_SOCKET_ENDPOINT ?? 'ws://localhost:4000'

export enum Scene {
  HOME = 'HOME',
  CAPTCHA = 'CAPTCHA',
  RESULT = 'RESULT',
}

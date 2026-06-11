export {};

declare global {
  interface Window {
    qbOpen?: () => void;
    qbClose?: () => void;
    qbNext?: () => void;
    qbPrev?: () => void;
    qbSend?: (channel: string) => void;
    mbOpen?: () => void;
    mbClose?: () => void;
    mbNext?: () => void;
    mbPrev?: () => void;
    mbSend?: (channel: string) => void;
    spaGo?: (section: string) => void;
  }
}

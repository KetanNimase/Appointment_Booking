declare module '@emailjs/nodejs' {
  export function init(options: { publicKey: string; privateKey: string }): void;
  export function send(
    serviceID: string,
    templateID: string,
    templateParams: Record<string, any>,
    options?: Record<string, any>
  ): Promise<any>;
}
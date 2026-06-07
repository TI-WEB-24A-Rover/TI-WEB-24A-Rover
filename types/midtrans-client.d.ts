declare module 'midtrans-client' {
  export class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameter: unknown): Promise<unknown>;
  }
  export class CoreApi {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    charge(parameter: unknown): Promise<unknown>;
  }
}

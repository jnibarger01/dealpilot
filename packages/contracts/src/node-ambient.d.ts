declare module "node:crypto" {
  export interface Hash {
    update(data: string | Uint8Array): Hash;
    digest(encoding: "hex"): string;
  }
  export function createHash(algorithm: string): Hash;
  export function randomUUID(): string;
}

declare module "node:http" {
  export interface IncomingMessage extends AsyncIterable<Uint8Array> {
    method?: string;
    url?: string;
    headers: Record<string, string | string[] | undefined>;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(data?: string): void;
  }

  export interface AddressInfo {
    port: number;
    address: string;
    family: string;
  }

  export interface Server {
    listen(port: number, hostname: string, callback: () => void): void;
    close(callback: () => void): void;
    address(): AddressInfo | string | null;
  }

  export function createServer(
    listener: (
      request: IncomingMessage,
      response: ServerResponse,
    ) => void | Promise<void>,
  ): Server;
}

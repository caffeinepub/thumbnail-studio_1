import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface backendInterface {
    applyCustomizationsToThumbnail(arg0: ExternalBlob, arg1: string): Promise<ExternalBlob>;
    enhanceThumbnail(arg0: ExternalBlob): Promise<ExternalBlob>;
    generateThumbnailFromText(arg0: string): Promise<ExternalBlob>;
    generateThumbnailsFromVideo(arg0: string): Promise<Array<ExternalBlob>>;
}

export const convertBufferToBase64Image = (buffer: typeof Buffer): string =>
  `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;

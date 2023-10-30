export const convertBufferToFile = (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) => {
  const uint8Array = new Uint8Array(fileBuffer);
  const blob = new Blob([uint8Array], { type: contentType });
  const file = new File([blob], fileName, {
    type: contentType,
  });
  return file;
};

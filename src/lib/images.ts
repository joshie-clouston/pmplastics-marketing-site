const allImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpeg,jpg,png,gif,webp}',
  { eager: true },
);

export function resolveImage(path: string): ImageMetadata | undefined {
  const key = `/src/assets/images/${path}`;
  return allImages[key]?.default;
}

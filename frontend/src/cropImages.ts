// High quality authentic photographic thumbnails for crops (locally hosted for offline reliability and speed)
export const CROP_IMAGES: Record<string, string> = {
  rice: "/crops/rice.jpg",
  cowpea: "/crops/cowpea.jpg",
  green_gram: "/crops/green_gram.jpg",
  black_gram: "/crops/black_gram.jpg",
  groundnut: "/crops/groundnut.jpg",
  banana: "/crops/banana.jpg",
  pepper: "/crops/pepper.jpg",
  coconut: "/crops/coconut.jpg",
  maize: "/crops/maize.jpg",
  rubber: "/crops/rubber.jpg",
  vegetables_bhindi: "/crops/vegetables_bhindi.jpg",
  sesame: "/crops/sesame.jpg",
};

export const DEFAULT_CROP_IMAGE = "/crops/rice.jpg";

export const getCropImage = (cropId: string): string => {
  return CROP_IMAGES[cropId] || DEFAULT_CROP_IMAGE;
};

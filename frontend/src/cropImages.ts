// High quality photographic thumbnails for crops
export const CROP_IMAGES: Record<string, string> = {
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80", // Lush green rice paddy
  cowpea: "https://images.unsplash.com/photo-1599818816828-5695029a7386?auto=format&fit=crop&w=600&q=80", // Cowpea / beans
  green_gram: "https://images.unsplash.com/photo-1589135233689-d56d95393043?auto=format&fit=crop&w=600&q=80", // Mung bean / green gram
  black_gram: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80", // Black lentils / pulses
  groundnut: "https://images.unsplash.com/photo-1567892328014-b6d8596ea351?auto=format&fit=crop&w=600&q=80", // Fresh groundnut harvest
  banana: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80", // Banana plantation
  pepper: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80", // Black pepper vines
  coconut: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80", // Coconut palms
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80", // Fresh corn / maize
  rubber: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80", // Rubber plantation forest
  vegetables_bhindi: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80", // Fresh green Okra / vegetables
  sesame: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" // Sesame seeds & crop
};

export const getCropImage = (cropId: string): string => {
  return CROP_IMAGES[cropId] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80";
};

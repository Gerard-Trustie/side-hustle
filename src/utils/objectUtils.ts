export const getOrderedPictures = (pictures: string[]): string[] => {
  return pictures
    .map((pic) => {
      const match = pic.match(/^(\d+)#(.+)$/);
      return match ? { index: parseInt(match[1]), name: match[2] } : null;
    })
    .filter((item): item is { index: number; name: string } => item !== null)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.name);
};

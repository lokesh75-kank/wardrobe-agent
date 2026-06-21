// Mock Instagram sync — rotates through a small seed of recent "posts".
// Swap in Instagram Graph API + Nebius vision later; the return shape stays the same.

export type InstagramWearEvent = {
  item: string;
  location: string;
  caption: string;
};

const SEED: InstagramWearEvent[] = [
  { item: "Olive Field Jacket", location: "Bestia", caption: "pasta night" },
  { item: "Cream Cable Knit", location: "Verve Coffee", caption: "slow morning" },
  { item: "Selvedge Denim", location: "The Broad", caption: "gallery day" },
  { item: "Chelsea Boots", location: "Echo Park", caption: "golden hour walk" },
  { item: "White Cotton Tee", location: "Sqirl", caption: "brunch" },
];

let cursor = 0;

export function nextInstagramWear(): InstagramWearEvent {
  const event = SEED[cursor % SEED.length];
  cursor += 1;
  return event;
}

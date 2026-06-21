import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, Send, Bookmark, Camera, MoreHorizontal } from "lucide-react";

type Garment = {
  id: string;
  name: string;
  category: string;
  image: string;
  instagram?: {
    photo: string;
    avatar: string;
    username: string;
    likes: number;
    caption: string;
    comments: { user: string; text: string }[];
    timestamp: string;
  };
};

// Unsplash placeholder URLs (free hot-linkable).
const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const GARMENTS: Garment[] = [
  {
    id: "navy-blazer",
    name: "Navy Blazer",
    category: "Outerwear",
    image: u("photo-1593030761757-71fae45fa0e7"),
    instagram: {
      photo: u("photo-1507003211169-0a1dd7228f2d", 800),
      avatar: u("photo-1535713875002-d1d0cf377fde", 200),
      username: "lokesh.style",
      likes: 432,
      caption: "Date night fit 🔥 #navyblazer #menswear",
      comments: [
        { user: "ayaan.fits", text: "Tailoring is immaculate 🙌" },
        { user: "thread.diary", text: "That lapel though 🔥" },
        { user: "sarah_", text: "see you at 8 😉" },
      ],
      timestamp: "2 days ago",
    },
  },
  {
    id: "olive-field-jacket",
    name: "Olive Field Jacket",
    category: "Outerwear",
    image: u("photo-1591047139829-d91aecb6caea"),
  },
  {
    id: "white-oxford",
    name: "White Oxford Shirt",
    category: "Top",
    image: u("photo-1602810318383-e386cc2a3ccf"),
    instagram: {
      photo: u("photo-1521572163474-6864f9cf17ab", 800),
      avatar: u("photo-1535713875002-d1d0cf377fde", 200),
      username: "lokesh.style",
      likes: 318,
      caption: "Sunday brunch in the trusty oxford ☕ #whiteoxford #ootd",
      comments: [
        { user: "menswear.daily", text: "Clean clean clean" },
        { user: "fitcheck", text: "Where's the shirt from?" },
      ],
      timestamp: "5 days ago",
    },
  },
  {
    id: "black-chinos",
    name: "Black Chinos",
    category: "Bottoms",
    image: u("photo-1473966968600-fa801b869a1a"),
  },
  {
    id: "brown-boots",
    name: "Brown Leather Boots",
    category: "Footwear",
    image: u("photo-1520639888713-7851133b1ed0"),
  },
  {
    id: "grey-hoodie",
    name: "Grey Hoodie",
    category: "Top",
    image: u("photo-1556821840-3a63f95609a7"),
  },
  {
    id: "denim-jacket",
    name: "Denim Jacket",
    category: "Outerwear",
    image: u("photo-1543076447-215ad9ba6923"),
    instagram: {
      photo: u("photo-1516257984-b1b4d707412e", 800),
      avatar: u("photo-1535713875002-d1d0cf377fde", 200),
      username: "lokesh.style",
      likes: 587,
      caption: "Festival weekend vibes 🎶 #denimjacket #weekendmood",
      comments: [
        { user: "rohan.k", text: "This fit goes hard 🔥🔥" },
        { user: "denim.head", text: "Selvedge? Looks killer" },
        { user: "mira", text: "📸📸📸" },
      ],
      timestamp: "1 week ago",
    },
  },
  {
    id: "linen-shirt",
    name: "Linen Shirt",
    category: "Top",
    image: u("photo-1622445275576-721325763afe"),
  },
  {
    id: "charcoal-suit",
    name: "Charcoal Suit",
    category: "Formal",
    image: u("photo-1594938298603-c8148c4dae35"),
  },
  {
    id: "running-sneakers",
    name: "Running Sneakers",
    category: "Footwear",
    image: u("photo-1542291026-7eec264c27ff"),
  },
  {
    id: "wool-sweater",
    name: "Wool Sweater",
    category: "Knitwear",
    image: u("photo-1620799140408-edc6dcb6d633"),
  },
  {
    id: "striped-tee",
    name: "Striped Tee",
    category: "Top",
    image: u("photo-1581655353564-df123a1eb820"),
  },
];

export function WardrobeGrid() {
  const [active, setActive] = useState<Garment | null>(null);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Wardrobe</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {GARMENTS.length} items
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GARMENTS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => g.instagram && setActive(g)}
            className="group relative text-left"
          >
            <div className="aspect-square overflow-hidden rounded-xl border border-rose-200 bg-white">
              <img
                src={g.image}
                alt={g.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {g.instagram && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-tr from-fuchsia-600 to-amber-500 px-2 py-0.5 text-[10px] font-medium text-white shadow">
                <Camera className="h-3 w-3" /> Posted
              </span>
            )}
            <p className="mt-2 truncate text-xs text-zinc-700">{g.name}</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-zinc-400">
              {g.category}
            </p>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-0">
          <DialogTitle className="sr-only">{active?.name} Instagram post</DialogTitle>
          {active?.instagram && (
            <div className="flex flex-col">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <img
                  src={active.instagram.avatar}
                  alt={active.instagram.username}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-rose-200"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900">
                    {active.instagram.username}
                  </p>
                  <p className="text-[10px] text-zinc-500">Los Angeles, CA</p>
                </div>
                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
              </div>
              <img
                src={active.instagram.photo}
                alt={active.name}
                className="aspect-square w-full object-cover"
              />
              <div className="px-3 pt-2.5">
                <div className="flex items-center gap-4">
                  <Heart className="h-6 w-6 text-rose-600" fill="currentColor" />
                  <MessageCircle className="h-6 w-6 text-zinc-800" />
                  <Send className="h-6 w-6 text-zinc-800" />
                  <Bookmark className="ml-auto h-6 w-6 text-zinc-800" />
                </div>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  {active.instagram.likes.toLocaleString()} likes
                </p>
                <p className="mt-1 text-sm text-zinc-800">
                  <span className="font-semibold">{active.instagram.username}</span>{" "}
                  {active.instagram.caption}
                </p>
                <div className="mt-2 space-y-1">
                  {active.instagram.comments.map((c, i) => (
                    <p key={i} className="text-sm text-zinc-700">
                      <span className="font-semibold">{c.user}</span> {c.text}
                    </p>
                  ))}
                </div>
                <p className="mb-3 mt-2 text-[10px] uppercase tracking-wider text-zinc-400">
                  {active.instagram.timestamp}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

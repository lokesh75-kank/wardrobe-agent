// Client-side wrappers around the Wardrobe Agent server functions.
// Components keep importing from here; the server functions live in
// `wardrobe.functions.ts` and call HydraDB + Nebius AI on the server.

import {
  getTodayRecommendationFn,
  sendAgentMessageFn,
  syncInstagramFn,
  getClosetStatsFn,
  type ChatMessage as ServerChatMessage,
  type ClothingItem as ServerClothingItem,
  type ContextWidget as ServerContextWidget,
  type TodayRecommendation as ServerTodayRecommendation,
  type ClosetStats as ServerClosetStats,
} from "./wardrobe.functions";

export type ClothingItem = ServerClothingItem;
export type ContextWidget = ServerContextWidget;
export type TodayRecommendation = ServerTodayRecommendation;
export type ChatMessage = ServerChatMessage;
export type ClosetStats = ServerClosetStats;

export function getTodayRecommendation(): Promise<TodayRecommendation> {
  return getTodayRecommendationFn();
}

export function sendAgentMessage(
  text: string,
  history: ChatMessage[],
): Promise<{ reply: string }> {
  return sendAgentMessageFn({ data: { text, history } });
}

export function syncInstagram(): Promise<{ loggedItem: string }> {
  return syncInstagramFn();
}

export function getClosetStats(): Promise<ClosetStats> {
  return getClosetStatsFn();
}

export type MessageRole = "user" | "assistant";

export interface ItineraryItem {
  time: string;
  text: string;
  name?: string;
  category?: string;
  rating?: number;
  address?: string;
  hours?: string;
  weather?: string;
  distance?: string;
  tags?: string[];
  mapsQuery?: string;
}

export interface ItineraryDay {
  label: string;
  badge: string;
  items: ItineraryItem[];
}

export interface Itinerary {
  intro?: string;
  days: ItineraryDay[];
  followUp?: string;
}

export interface ChatMessageType {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** Only assistant replies that arrived live from the webhook animate in. */
  animate?: boolean;
  /** Structured rich reply (used for the bundled demo itinerary). */
  itinerary?: Itinerary;
  /** Set when this assistant message represents a failed/empty reply, for distinct error-state rendering. */
  errorType?: "network" | "timeout" | "empty";
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessageType[];
  updatedAt: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "error" | "info";
}

export interface WebhookResponse {
  reply: string;
}

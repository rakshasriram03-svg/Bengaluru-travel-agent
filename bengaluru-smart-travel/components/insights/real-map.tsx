"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useChat } from "@/components/providers/chat-provider";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

type TrafficStatus = "congested" | "normal" | "fluid";

const TRAFFIC_POINTS: { name: string; lat: number; lng: number; status: TrafficStatus }[] = [
  { name: "Silk Board Junction", lat: 12.9166, lng: 77.6228, status: "congested" },
  { name: "MG Road", lat: 12.9758, lng: 77.6045, status: "congested" },
  { name: "Whitefield", lat: 12.9698, lng: 77.75, status: "congested" },
  { name: "Koramangala", lat: 12.9352, lng: 77.6245, status: "normal" },
  { name: "Indiranagar", lat: 12.9719, lng: 77.6412, status: "normal" },
  { name: "Electronic City", lat: 12.8452, lng: 77.6602, status: "normal" },
  { name: "Cubbon Park", lat: 12.9763, lng: 77.5929, status: "fluid" },
  { name: "Lalbagh", lat: 12.9507, lng: 77.5848, status: "fluid" },
];

const STATUS_COLOR: Record<TrafficStatus, string> = {
  congested: "#8b5cf6",
  normal: "#3b82f6",
  fluid: "#10b981",
};

export function RealMap() {
  const { dark } = useChat();
  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
      />
      {TRAFFIC_POINTS.map((p) => (
        <CircleMarker
          key={p.name}
          center={[p.lat, p.lng]}
          radius={9}
          pathOptions={{ color: "#ffffff", weight: 2, fillColor: STATUS_COLOR[p.status], fillOpacity: 0.9 }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            <span className="text-xs font-medium capitalize">
              {p.name} · {p.status}
            </span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

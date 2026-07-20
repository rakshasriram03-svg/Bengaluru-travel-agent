import { Bot } from "lucide-react";

export const metadata = { title: "Support • Bengaluru Smart" };

export default function SupportPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-bold">Need help?</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Ask the assistant anything from the Itineraries tab, or reach out — the chat is wired straight to your n8n
        webhook, configurable from Settings (the avatar icon, top right).
      </p>
    </div>
  );
}

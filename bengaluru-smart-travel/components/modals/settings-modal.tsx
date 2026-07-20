"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/components/providers/chat-provider";

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen, dark, setDark, webhookUrl, setWebhookUrl, clearAll } = useChat();
  const [draftUrl, setDraftUrl] = useState(webhookUrl);

  useEffect(() => setDraftUrl(webhookUrl), [webhookUrl, settingsOpen]);

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-muted-foreground">Toggle dark or light theme</p>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
            </button>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">n8n webhook URL</p>
            <Input
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              onBlur={() => setWebhookUrl(draftUrl)}
              placeholder="https://your-n8n-domain/webhook/travel-assistant"
              className="bg-black"
            />
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium">Data</p>
            <Button variant="destructive" className="w-full" onClick={clearAll}>
              <Trash2 className="h-3.5 w-3.5" /> Clear all chats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

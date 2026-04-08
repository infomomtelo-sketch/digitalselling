import { useState } from "react";
import { Share2, Twitter, Facebook, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
}

const ShareButtons = ({ url, title, description }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const text = `Check out "${title}" on dropvault`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Share2 size={12} /> Share
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter size={14} />
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={14} />
      </a>
      <button
        onClick={copyLink}
        className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check size={14} className="text-primary" /> : <Link2 size={14} />}
      </button>
    </div>
  );
};

export default ShareButtons;

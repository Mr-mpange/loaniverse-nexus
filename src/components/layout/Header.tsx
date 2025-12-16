import { Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationDropdown } from "./NotificationDropdown";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search - Command Palette Trigger */}
        <Button
          variant="outline"
          className="w-72 justify-start text-muted-foreground bg-muted/50 border-border/50 hover:bg-muted"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: true,
            });
            document.dispatchEvent(event);
          }}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">Search loans, documents...</span>
          <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationDropdown />
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "./button";
import { DEFAULT_TAGS } from "@/app/(auth)/knowledge/knowledge.types";
import { TTag } from "@/app/(auth)/knowledge/knowledge.types";

interface MultiSelectProps {
  selected: TTag[];
  onChange: (selected: TTag[]) => void;
}

export function MultiSelect({ selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selected.length && "text-muted-foreground"
          )}
        >
          {selected.length ? (
            <div className="flex gap-1 flex-wrap">
              {selected.map((tag) => (
                <Badge
                  key={tag.tagId}
                  variant="secondary"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((s) => s.tagId !== tag.tagId));
                  }}
                >
                  {tag.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          ) : (
            "Select tags..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandGroup>
            {DEFAULT_TAGS.map((tag) => (
              <CommandItem
                key={tag.tagId}
                onSelect={() => {
                  onChange(
                    selected.some((s) => s.tagId === tag.tagId)
                      ? selected.filter((s) => s.tagId !== tag.tagId)
                      : [...selected, tag]
                  );
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.some((s) => s.tagId === tag.tagId)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {tag.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

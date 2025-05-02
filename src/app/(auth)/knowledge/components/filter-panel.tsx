"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  TResource,
  TTag,
  RESOURCE_TYPES,
  RESOURCE_STATUSES,
  DEFAULT_TAGS,
} from "../knowledge.types";
import { Tangent } from "lucide-react";

interface FilterPanelProps {
  selectedTags: TTag[];
  onTagSelect: (tag: TTag) => void;
  onTagDeselect: (tag: TTag) => void;
  selectedTypes: Set<TResource["type"]>;
  onTypeSelect: (type: TResource["type"]) => void;
  onTypeDeselect: (type: TResource["type"]) => void;
  selectedStatuses: Set<string>;
  onStatusSelect: (status: string) => void;
  onStatusDeselect: (status: string) => void;
}
export function FilterPanel({
  selectedTags,
  onTagSelect,
  onTagDeselect,
  selectedTypes,
  onTypeSelect,
  onTypeDeselect,
  selectedStatuses,
  onStatusSelect,
  onStatusDeselect,
}: FilterPanelProps) {
  return (
    <div className="space-y-4 w-full">
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Filter by Type</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col space-y-1">
            {RESOURCE_TYPES.map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.has(type) ? "default" : "outline"}
                className={`cursor-pointer w-full justify-start text-xs ${
                  selectedTypes.has(type)
                    ? "bg-primary-500 hover:bg-primary-500/90"
                    : ""
                }`}
                onClick={() => {
                  selectedTypes.has(type)
                    ? onTypeDeselect(type)
                    : onTypeSelect(type);
                }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Filter by Status</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col space-y-1">
            {RESOURCE_STATUSES.map((status) => (
              <Badge
                key={status}
                variant={selectedStatuses.has(status) ? "default" : "outline"}
                className={`cursor-pointer w-full justify-start text-xs ${
                  selectedStatuses.has(status)
                    ? "bg-primary-500 hover:bg-primary-500/90"
                    : ""
                }`}
                onClick={() => {
                  selectedStatuses.has(status)
                    ? onStatusDeselect(status)
                    : onStatusSelect(status);
                }}
              >
                {status}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle className="text-sm">Filter by Tags</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-1">
            {DEFAULT_TAGS.map((tag) => (
              <Badge
                key={tag.tagId}
                variant={
                  selectedTags.some((t) => t.tagId === tag.tagId)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer w-full justify-start text-xs ${
                  selectedTags.some((t) => t.tagId === tag.tagId)
                    ? "bg-primary-500 hover:bg-primary-500/90"
                    : ""
                }`}
                onClick={() =>
                  selectedTags.some((t) => t.tagId === tag.tagId)
                    ? onTagDeselect(tag)
                    : onTagSelect(tag)
                }
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

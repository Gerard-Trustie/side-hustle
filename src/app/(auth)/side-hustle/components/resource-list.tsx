"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TResource } from "@/app/(auth)/knowledge/knowledge.types";
import AnimatedSpinner from "@/components/AnimatedSpinner";

interface ResourceListProps {
  resources: TResource[];
  isLoading: boolean;
  onEdit: (resource: TResource) => void;
  searchQuery: string;
}

export function ResourceList({
  resources,
  isLoading,
  onEdit,
  searchQuery,
}: ResourceListProps) {
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary/5">
          <TableHead className="w-[40%] text-primary">Title</TableHead>
          <TableHead className="w-[15%] text-primary">Type</TableHead>
          <TableHead className="w-[15%] text-primary">Status</TableHead>
          <TableHead className="w-[20%] text-primary">Tags</TableHead>
          <TableHead className="w-[10%] text-right text-primary">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex items-center justify-center py-8">
                <AnimatedSpinner size={60} isCircle={false} />
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {filteredResources.map((resource) => (
            <TableRow key={resource.resourceId}>
              <TableCell className="font-medium">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {resource.title}
                </a>
              </TableCell>
              <TableCell>{resource.type}</TableCell>
              <TableCell>
                <Badge variant="outline">{resource.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {resource.tags?.map((tag) => (
                    <Badge key={tag.tagId} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(resource)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

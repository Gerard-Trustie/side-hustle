"use client";

import React, { useState } from "react";
import { ResourceList } from "./components/resource-list";
import { ResourceDialog } from "./components/resource-dialog";
import { FilterPanel } from "./components/filter-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { getResources } from "@/actions/knowledge";
import { useRouter } from "next/navigation";
import { TResource, TTag } from "@/app/(auth)/knowledge/knowledge.types";

export function ResourceManager() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<TResource | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<TTag[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );
  const [resources, setResources] = useState<TResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load resources on mount
  React.useEffect(() => {
    async function loadResources() {
      try {
        const data = await getResources();
        setResources(data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadResources();
  }, []);

  const filteredResources = React.useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedTypes.size === 0 || selectedTypes.has(resource.type);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          resource.tags.some((t) => t.tagId === tag.tagId)
        );
      const matchesStatus =
        selectedStatuses.size === 0 || selectedStatuses.has(resource.status);
      return matchesSearch && matchesType && matchesTags && matchesStatus;
    });
  }, [resources, searchQuery, selectedTypes, selectedTags, selectedStatuses]);

  const handleEdit = (resource: TResource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingResource(null);
    router.refresh(); // This will trigger a server revalidation
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex gap-2">
          <div className="flex gap-2 w-1/2">
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant={searchQuery ? "default" : "secondary"}
              size="icon"
              disabled={!searchQuery}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1" />
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 w-[200px]"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <ResourceList
            resources={filteredResources}
            isLoading={isLoading}
            onEdit={handleEdit}
            searchQuery={searchQuery}
          />
        </div>

        <div className="w-[200px] flex-none space-y-4">
          <FilterPanel
            selectedTags={selectedTags}
            onTagSelect={(tag) => setSelectedTags([...selectedTags, tag])}
            onTagDeselect={(tag) =>
              setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
            }
            selectedTypes={selectedTypes}
            onTypeSelect={(type) =>
              setSelectedTypes(new Set([...selectedTypes, type]))
            }
            onTypeDeselect={(type) => {
              const newTypes = new Set(selectedTypes);
              newTypes.delete(type);
              setSelectedTypes(newTypes);
            }}
            selectedStatuses={selectedStatuses}
            onStatusSelect={(status) =>
              setSelectedStatuses(new Set([...selectedStatuses, status]))
            }
            onStatusDeselect={(status) => {
              const newStatuses = new Set(selectedStatuses);
              newStatuses.delete(status);
              setSelectedStatuses(newStatuses);
            }}
          />
        </div>
      </div>

      <ResourceDialog
        open={showForm}
        onOpenChange={setShowForm}
        resource={editingResource}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

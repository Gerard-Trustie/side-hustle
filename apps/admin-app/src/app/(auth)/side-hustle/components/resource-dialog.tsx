"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { MultiSelect } from "@components/ui/multi-select";
import {
  RESOURCE_TYPES,
  RESOURCE_STATUSES,
  TResource,
} from "../knowledge.types";
import { addResource, updateResource } from "@/actions/knowledge";
import { uploadKnowledgeFileToS3 } from "@/actions/s3Actions";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

const formSchema = z.object({
  source: z.object({
    type: z.enum(["url", "file"]),
    url: z.string().url({ message: "Please enter a valid URL" }).optional(),
    file: z.any().optional(),
  }),
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })),
  status: z.string().min(1, "Status is required"),
});

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: TResource | null;
  onSuccess: () => void;
}

export function ResourceDialog({
  open,
  onOpenChange,
  resource,
  onSuccess,
}: ResourceDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: {
        type: "url",
        url: resource?.url || "",
        file: undefined,
      },
      title: resource?.title || "",
      author: resource?.author || "",
      type: resource?.type || "",
      notes: resource?.notes || "",
      tags: resource?.tags || [],
      status: resource?.status || "To Review",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let url = data.source.url;

      if (data.source.type === "file" && data.source.file) {
        try {
          url = await uploadKnowledgeFileToS3(data.source.file);
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to upload file to S3.",
            variant: "destructive",
          });
          return;
        }
      }

      const resourceData = {
        ...data,
        url,
      };

      if (resource) {
        await updateResource(resource.SK, resource.resourceId, resourceData);
        toast({
          title: "Resource updated",
          description: "Your resource has been updated successfully.",
        });
      } else {
        await addResource(resourceData);
        toast({
          title: "Resource added",
          description: "Your resource has been added successfully.",
        });
      }
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your resource.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Edit Resource" : "Add New Resource"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source.type"
              render={({ field }) => (
                <FormItem>
                  <Tabs
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="file">File Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="url">
                      <FormField
                        control={form.control}
                        name="source.url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="file">
                      <FormField
                        control={form.control}
                        name="source.file"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                  }
                                }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESOURCE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESOURCE_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add your notes here..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {resource ? "Update" : "Add"} Resource
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

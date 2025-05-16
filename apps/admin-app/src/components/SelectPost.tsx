import React, { useState, useEffect } from "react";
import { TPost } from '@types';
import Image from "next/image";
import { searchEvent } from "@/actions/searchEvent";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui/table";
import {
  Pagination,
  PaginationPrevious,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@components/ui/pagination";

interface SelectPostProps {
  searchTerm: string | null;
  searchTitle: string;
  userId: string | null;
  onSearchComplete: () => void;
}

const SelectPost: React.FC<SelectPostProps> = ({
  searchTerm,
  searchTitle,
  userId,
  onSearchComplete,
}) => {
  const [options, setOptions] = useState<TPost[] | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSearchComplete, setIsSearchComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2; // Number of items per page

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    console.log("🚀 ~ SelectPost ~ useEffectsearchTerm:", searchTerm);
    const fetchEvents = async () => {
      try {
        const eventsArray = await searchEvent(
          searchTerm!,
          "post",
          userId!,
          currentPage,
          limit
        );
        console.log("🚀 ~ fetchEvents ~ eventsArray:", eventsArray);
        const params = new URLSearchParams(searchParams);

        if (eventsArray?.length === 0) {
          params.set("eventId", "null");
          params.set("eventType", "null");
          setSelectedEventId(null);
        } else if (eventsArray?.length === 1) {
          params.set("eventId", eventsArray[0].userId);
          params.set("eventType", "post_detail");
          setSelectedEventId(eventsArray[0].userId);
        } else if (eventsArray?.length > 1) {
          params.delete("eventId");
          params.delete("eventType");
          setSelectedEventId(null);
        }

        replace(`${pathname}?${params.toString()}`);
        setOptions(eventsArray || []);
        setIsSearchComplete(true);
        setTotalPages(Math.ceil(eventsArray?.length / limit));
        onSearchComplete();
      } catch (err) {
        console.error("Error fetching events:", err);
        setIsSearchComplete(true);
        onSearchComplete();
      }
    };

    if (searchTerm && userId) {
      setIsSearchComplete(false);
      fetchEvents();
    }
  }, [searchTerm, userId, currentPage, searchParams, pathname, replace]);

  const handleRowClick = (eventId: string | null) => {
    console.log("🚀 ~ handleRowClick ~ eventId:", eventId);
    setSelectedEventId(eventId);

    const params = new URLSearchParams(searchParams);
    if (eventId) {
      params.set("eventId", eventId);
      params.set("eventType", "post_detail");
    } else {
      params.delete("eventId");
      params.delete("eventType");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  console.log("🚀 ~ SelectTrustie selectedEventId:", selectedEventId, options);

  if (!isSearchComplete) return null;
  if (isSearchComplete && (!options || options.length === 0))
    return (
      <div className="mb-4 max-w-md">
        <label
          htmlFor="userId"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          No Posts found... Please try a different search term.
        </label>
      </div>
    );

  return (
    <>
      <div className="mb-4 max-w-2xl">
        <label
          htmlFor="userId"
          className="block text-lg font-semibold text-gray-700 mb-4"
        >
          {searchTitle}
        </label>
        <Table className="w-full ">
          <TableHeader className="bg-primary-200 rounded-lg">
            <TableRow>
              <TableHead className="px-4 font-bold text-white">
                Preview
              </TableHead>
              <TableHead className="px-15 font-bold text-white">
                Title
              </TableHead>
              <TableHead className="px-15 font-bold text-white">
                Description
              </TableHead>
              <TableHead className="px-4 font-bold text-white">Date</TableHead>
              <TableHead className="px-4 font-bold text-white">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options?.map((event) => (
              <TableRow
                key={event.eventId}
                onClick={() => handleRowClick(event.eventId)}
                className="cursor-pointer"
              >
                <TableCell className="p-4">
                  {event.preview && (
                    <Image
                      src={event.preview}
                      alt="User Avatar"
                      width={14}
                      height={22}
                      className={`w-14 h-22 text-xs rounded`}
                    />
                  )}
                </TableCell>
                <TableCell className="p-4 font-bold">{event.title}</TableCell>
                <TableCell className="p-4">{event.description}</TableCell>
                <TableCell className="p-4">
                  {new Date(event.created).toLocaleDateString()}
                </TableCell>
                <TableCell className="p-4">{event.lastStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            isActive={currentPage > 1}
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            isActive={currentPage < totalPages}
          />
        </Pagination>
      )}
    </>
  );
};

export default SelectPost;

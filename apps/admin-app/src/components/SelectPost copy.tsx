import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Colors } from "@/themes/colors";
import { TPost } from "@/constants/types";
import { EventBasicInfo } from "@/components/eventBasicInfo";
import { searchEvent } from "@/actions/searchEvent";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SelectPostProps {
  searchTerm: string | null;
  searchTitle: string;
  userId: string | null;
}

const SelectPost: React.FC<SelectPostProps> = ({
  searchTerm,
  searchTitle,
  userId,
}) => {
  const [options, setOptions] = useState<TPost[] | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSearchComplete, setIsSearchComplete] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    console.log("🚀 ~ SelectPost ~ useEffectsearchTerm:", searchTerm);
    const fetchEvents = async () => {
      try {
        const eventsArray = await searchEvent(searchTerm!, "post", userId!);
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
      } catch (err) {
        console.error("Error fetching events:", err);
        setIsSearchComplete(true);
      }
    };

    if (searchTerm && userId) {
      setIsSearchComplete(false);
      fetchEvents();
    }
  }, [searchTerm, userId, searchParams, pathname, replace]);

  const eventsOptions = options?.map((event) => ({
    value: event.eventId,
    label: <EventBasicInfo eventInfo={event} size="small" />,
  }));

  const handleChange = (
    option: { value: string; label: React.ReactNode } | null
  ) => {
    const newEventId = option ? option.value : null;
    console.log("🚀 ~ newEventId:", newEventId);
    setSelectedEventId(newEventId);

    const params = new URLSearchParams(searchParams);
    if (newEventId) {
      params.set("eventId", newEventId);
      params.set("eventType", "post_detail");
    } else {
      params.delete("eventId");
      params.delete("eventType");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
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
      <div className="mb-4 max-w-md">
        <label
          htmlFor="userId"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {searchTitle}
        </label>
        <Select
          options={eventsOptions}
          value={eventsOptions?.find(
            (option) => option.value === selectedEventId
          )}
          onChange={handleChange}
          className="w-full"
          classNamePrefix="react-select"
          formatOptionLabel={({ label }) => label}
          styles={{
            control: (provided, state) => ({
              ...provided,
              borderRadius: "0.375rem",
              borderColor: state.isFocused ? Colors.primary500 : "#D1D5DB",
              boxShadow: state.isFocused
                ? `0 0 0 1px ${Colors.primary500}`
                : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              "&:hover": {
                borderColor: state.isFocused
                  ? Colors.primary500
                  : Colors.primary200,
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? Colors.primary500 : "white",
              color: state.isSelected ? "white" : "black",
              "&:hover": {
                backgroundColor: state.isSelected
                  ? Colors.primary500
                  : "#F3F4F6",
              },
            }),
          }}
        />
      </div>
    </>
  );
};

export default SelectPost;

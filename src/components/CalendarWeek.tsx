import { format } from "date-fns";
import { FlatList, View } from "react-native";

import { CalendarWeekDay } from "components/CalendarWeekDay";

// Types
import { Day } from "types";

interface CalendarWeekProps {
  week: Day[];
}

export default function CalendarWeek({ week }: CalendarWeekProps) {
  return (
    <FlatList
      data={week}
      renderItem={({ item, index }) => {
        return (
          <View
            key={item.dateString + index}
            className="flex min-h-28 flex-1 items-center justify-center"
          >
            <CalendarWeekDay day={item} />
          </View>
        );
      }}
      keyExtractor={(item) => format(item.date, "yyyy-MMM-dd")}
      className="-mt-0.5 max-h-[calc(100%-65px)]"
    />
  );
}

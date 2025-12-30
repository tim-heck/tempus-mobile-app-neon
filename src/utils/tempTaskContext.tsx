import { format, roundToNearestHours, set } from "date-fns";
import { ReactNode, createContext, useContext, useState } from "react";

import { ColorMenuItem } from "types";
import CalendarContext from "./calendarContext";
import { taskBaseColors } from "./constants";

export type TempTaskState = {
  tempName: string;
  setTempName: (name: string) => void;
  tempStartDateTime: Date;
  setTempStartDateTime: (date: Date) => void;
  tempEndDateTime: Date;
  setTempEndDateTime: (date: Date) => void;
  tempTaskColor: ColorMenuItem;
  setTempTaskColor: (colorItem: ColorMenuItem) => void;
  tempNotes: string;
  setTempNotes: (notes: string) => void;
  clearTempTask: () => void;
};

const TempTaskContext = createContext<TempTaskState | null>(null);

interface TempTaskContextProps {
  children: ReactNode;
}

export function TempTaskProvider({ children }: TempTaskContextProps) {
  const calendarContext = useContext(CalendarContext);
  const date = calendarContext?.displayedDay || new Date();
  const currentStartHours = roundToNearestHours(new Date(), {
    roundingMethod: "floor",
  });
  const currentEndHours = roundToNearestHours(new Date(), {
    roundingMethod: "ceil",
  });

  const [tempName, setTempName] = useState<string>("");
  const [tempStartDateTime, setTempStartDateTime] = useState<Date>(
    set(date, {
      hours: Number(format(currentStartHours, "HH")),
      minutes: Number(format(currentStartHours, "mm")),
    })
  );
  const [tempEndDateTime, setTempEndDateTime] = useState<Date>(
    set(date, {
      hours: Number(format(currentEndHours, "HH")),
      minutes: Number(format(currentEndHours, "mm")),
    })
  );
  const [tempTaskColor, setTempTaskColor] = useState<ColorMenuItem>(
    taskBaseColors["bg-teal-500"]
  );
  const [tempNotes, setTempNotes] = useState<string>("");

  const clearTempTask = () => {
    setTempName("");
    setTempStartDateTime(
      set(date, {
        hours: Number(format(currentStartHours, "HH")),
        minutes: Number(format(currentStartHours, "mm")),
      })
    );
    setTempEndDateTime(
      set(date, {
        hours: Number(format(currentEndHours, "HH")),
        minutes: Number(format(currentEndHours, "mm")),
      })
    );
    setTempTaskColor(taskBaseColors["bg-teal-500"]);
    setTempNotes("");
  };

  const value = {
    tempName,
    setTempName,
    tempStartDateTime,
    setTempStartDateTime,
    tempEndDateTime,
    setTempEndDateTime,
    tempTaskColor,
    setTempTaskColor,
    tempNotes,
    setTempNotes,
    clearTempTask,
  };

  return (
    <TempTaskContext.Provider value={value}>
      {children}
    </TempTaskContext.Provider>
  );
}

export default TempTaskContext;

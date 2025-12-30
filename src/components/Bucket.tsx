import { format } from "date-fns";
import { ReactNode, useRef } from "react";
import { View } from "react-native";

import { BucketElement, OverlappedBucket } from "types";
import DisplayedTask from "./DisplayedTask";

interface BucketProps {
  bucketedTasks: BucketElement[];
  setIsDragging: (isDragging: boolean) => void;
}

const borderWidth = 2;

export default function Bucket({ bucketedTasks }: BucketProps) {
  const bucketRef = useRef<React.ElementRef<typeof View>>(null);

  const handleTaskPosition = (date: Date) => {
    const midnight = new Date(format(date, "yyyy-MMM-dd") + " 12:00 AM");
    const timeSinceMidnight = (date.getTime() - midnight.getTime()) / 60 / 1000;
    return timeSinceMidnight + borderWidth;
  };

  const renderBuckets = () => {
    const overlappingBuckets: { [key: string]: OverlappedBucket } = {};
    Object.entries(bucketedTasks).forEach(([bucketId, bucket]) => {
      // Sort longer tasks first witnin buckets
      bucket.tasks.sort((a, b) => {
        return (
          b.endDateTime.getTime() -
          b.startDateTime.getTime() -
          (a.endDateTime.getTime() - a.startDateTime.getTime())
        );
      });
      const overlappingId = "overlappingBucket" + bucketId;
      if (Number(bucketId) === 0) {
        overlappingBuckets[overlappingId] = {
          earliestTime: bucket.earliestTime,
          latestTime: bucket.latestTime,
          buckets: [bucket],
        };
        return;
      }
      let overlap = false;
      Object.values(overlappingBuckets).forEach((overlapBucket) => {
        // Checks for tasks overlapping in time
        if (
          (bucket.earliestTime >= overlapBucket.earliestTime &&
            bucket.earliestTime < overlapBucket.latestTime) ||
          (bucket.latestTime > overlapBucket.earliestTime &&
            bucket.latestTime <= overlapBucket.latestTime) ||
          (bucket.earliestTime < overlapBucket.latestTime &&
            bucket.latestTime > overlapBucket.earliestTime)
        ) {
          overlap = true;
          // Updates earliest time within overlapping bucket
          if (bucket.earliestTime < overlapBucket.earliestTime) {
            overlapBucket.earliestTime = bucket.earliestTime;
          }
          // Updates latest time within overlapping bucket
          if (bucket.latestTime > overlapBucket.latestTime) {
            overlapBucket.latestTime = bucket.latestTime;
          }
          overlapBucket.buckets.push(bucket);
        }
      });
      // Creates new overlapping bucket if no overlap was found for current bucket
      if (!overlap) {
        overlappingBuckets[overlappingId] = {
          earliestTime: bucket.earliestTime,
          latestTime: bucket.latestTime,
          buckets: [bucket],
        };
      }
    });

    const bucketsToDisplay: ReactNode[] = [];

    // TODO: Needs help
    Object.values(overlappingBuckets).forEach((overlappingBucket) => {
      for (let i = 0; i < overlappingBucket.buckets.length; i++) {
        for (let j = i + 1; j < overlappingBucket.buckets.length; j++) {
          if (
            overlappingBucket.buckets[i].latestTime >
            overlappingBucket.buckets[j].earliestTime
          ) {
            overlappingBucket.buckets[j].overlapCount =
              overlappingBucket.buckets[i].overlapCount + 1;
          }
        }
      }
    });

    Object.values(overlappingBuckets).forEach((overlappingBuckets) => {
      overlappingBuckets.buckets.forEach((bucket, bucketId) => {
        const bucketTop = handleTaskPosition(bucket.earliestTime);
        const left: ReactNode[] = [];
        const right: ReactNode[] = [];
        const normal: ReactNode[] = [];
        const bucketStartDateTimeThreshold = new Date(
          bucket.tasks[0].startDateTime.getTime() + 30 * 60000
        );
        bucket.tasks.forEach((task, index) => {
          if (index === 0) {
            left.push(<DisplayedTask key={bucketId + task.id} task={task} />);
            return;
          }
          if (index === 1) {
            right.push(<DisplayedTask key={bucketId + task.id} task={task} />);
            return;
          }
          if (
            index % 2 === 0 &&
            !(
              task.startDateTime >= bucket.tasks[0].startDateTime &&
              task.startDateTime < bucketStartDateTimeThreshold
            )
          ) {
            left.push(<DisplayedTask key={bucketId + task.id} task={task} />);
            return;
          }
          if (
            index % 2 !== 0 &&
            !(
              task.startDateTime >= bucket.tasks[0].startDateTime &&
              task.startDateTime < bucketStartDateTimeThreshold
            )
          ) {
            right.push(<DisplayedTask key={bucketId + task.id} task={task} />);
            return;
          }
          normal.push(<DisplayedTask key={bucketId + task.id} task={task} />);
        });

        bucketsToDisplay.push(
          <View
            key={bucket.tasks[0].bucketId + bucketId}
            ref={bucketRef}
            className="absolute right-0 z-50 flex flex-row justify-end"
            style={{
              top: bucketTop,
              paddingLeft: bucket.overlapCount * 10,
            }}
          >
            {left.length ? (
              <View
                className="flex-1"
                style={{
                  maxWidth: normal.length
                    ? `${100 / (normal.length + 2)}%`
                    : "100%",
                }}
              >
                {left}
              </View>
            ) : null}
            {right.length ? (
              <View
                className="flex-1"
                style={{
                  maxWidth: normal.length
                    ? `${100 / (normal.length + 2)}%`
                    : "100%",
                }}
              >
                {right}
              </View>
            ) : null}
            {normal.length ? <View className="flex-1">{normal}</View> : null}
          </View>
        );
      });
    });

    if (!bucketsToDisplay.length) {
      return null;
    }

    return bucketsToDisplay;
  };

  return <View className="absolute h-full w-full">{renderBuckets()}</View>;
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Circle } from "lucide-react";

interface IAnnouncement {
  announcement: {
    content: string;
    title: string;
  };
  id: number;
  isRead: boolean;
}
interface AnnouncementItemProps {
  announcement: IAnnouncement;
  markAsRead: (id: number) => void;
  isUnread: boolean;
}

export function AnnouncementItem({
  announcement,
  markAsRead,
  isUnread,
}: AnnouncementItemProps) {
  return (
    <Card
      className={`transition-all ${
        isUnread ? "border-l-4 border-l-blue-500" : "bg-gray-50"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {isUnread && (
              <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
            )}
            <CardTitle
              className={`text-lg ${
                isUnread ? "font-semibold" : "text-gray-700"
              }`}
            >
              {announcement.announcement.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm ${isUnread ? "text-gray-800" : "text-gray-600"}`}
        >
          {announcement.announcement.content}
        </p>
      </CardContent>
      {isUnread && (
        <CardFooter className="pt-0 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => markAsRead(announcement.id)}
          >
            <Check className="h-3 w-3" />
            Mark as read
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

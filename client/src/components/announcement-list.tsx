import { AnnouncementItem } from "./announcement-item";

interface IAnnouncement {
  announcement: {
    content: string;
    title: string;
  };
  id: number;
  isRead: boolean;
}

interface AnnouncementsListProps {
  announcements: IAnnouncement[];
  markAsRead: (id: number) => void;
  isUnread: boolean;
}

export function AnnouncementsList({
  announcements,
  markAsRead,
  isUnread,
}: AnnouncementsListProps) {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementItem
          key={announcement.id}
          announcement={announcement}
          markAsRead={markAsRead}
          isUnread={isUnread}
        />
      ))}
    </div>
  );
}

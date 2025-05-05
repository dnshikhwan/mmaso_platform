import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AnnouncementsList } from "@/components/announcement-list";
import Layout from "@/components/layout";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosConfig } from "@/axiosConfig";

interface IAnnouncement {
  announcement: {
    content: string;
    title: string;
  };
  id: number;
  isRead: boolean;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);

  const fetchAnnouncementByStudent = async () => {
    try {
      const response = await axiosConfig.get(
        "/announcement/get-announcement-by-student"
      );
      console.log(response.data.details);
      setAnnouncements(response.data.details.announcements);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchAnnouncementByStudent();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      setAnnouncements(
        announcements.map((announcement) =>
          announcement.id === id
            ? { ...announcement, isRead: true }
            : announcement
        )
      );

      const response = await axiosConfig.get(
        `/announcement/mark-as-read/${id}`
      );
      toast.success(response.data.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const unreadAnnouncements = announcements.filter(
    (announcement) => !announcement.isRead
  );
  const readAnnouncements = announcements.filter(
    (announcement) => announcement.isRead
  );
  return (
    <Layout heading="Communication" subheading="Announcements">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <main className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-gray-700" />
                <h1 className="text-2xl font-bold">Announcements</h1>
              </div>
            </div>

            {unreadAnnouncements.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Unread Announcements
                </h2>
                <AnnouncementsList
                  announcements={unreadAnnouncements}
                  markAsRead={markAsRead}
                  isUnread={true}
                />
              </div>
            ) : (
              <div className="mb-8 p-6 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No unread announcements</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Read Announcements
              </h2>
              {readAnnouncements.length > 0 ? (
                <AnnouncementsList
                  announcements={readAnnouncements}
                  markAsRead={markAsRead}
                  isUnread={false}
                />
              ) : (
                <div className="p-6 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No read announcements</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;

import AdminLayout from "@/components/admin-layout";
import AnnouncementForm from "@/components/announcement-form";

const AddAnnouncement = () => {
  return (
    <AdminLayout heading="Announcements" subheading="Add Announcements">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <AnnouncementForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddAnnouncement;

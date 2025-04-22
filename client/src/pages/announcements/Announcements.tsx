import AdminLayout from "@/components/admin-layout";

const Announcements = () => {
    return (
        <AdminLayout heading="Announcements" subheading="View Announcements">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
            </div>
        </AdminLayout>
    );
};

export default Announcements;

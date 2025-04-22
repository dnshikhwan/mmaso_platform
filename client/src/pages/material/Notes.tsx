import Layout from "@/components/layout";
import { StudyNotesPage } from "@/components/study-notes-page";

const Notes = () => {
    return (
        <Layout heading="Notes " subheading="All notes">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <StudyNotesPage />
                </div>
            </div>
        </Layout>
    );
};

export default Notes;

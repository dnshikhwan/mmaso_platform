import { axiosConfig } from "@/axiosConfig";
import Layout from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IStudent } from "@/interfaces/student.interface";
import { AxiosError } from "axios";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
    const [student, setStudent] = useState<IStudent | undefined>(undefined);

    const fetchStudent = async () => {
        try {
            const response = await axiosConfig.get("/student/profile");
            setStudent(response.data.details.profile);
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.message);
            }
        }
    };

    useEffect(() => {
        fetchStudent();
    }, []);

    return (
        <Layout heading="Overview" subheading="Profile">
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="container mx-auto max-w-3xl">
                        <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-500" />
                            <div className="relative px-6">
                                <Avatar className="h-24 w-24 absolute -top-12 ring-4 ring-white">
                                    <AvatarImage
                                        src="https://i.pravatar.cc/96"
                                        alt="Profile"
                                    />
                                    <AvatarFallback>JS</AvatarFallback>
                                </Avatar>
                            </div>

                            <CardHeader className="pt-12">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-2xl font-bold">
                                        {student?.name}
                                    </CardTitle>

                                    <div className="flex space-x-2 pt-1">
                                        <Badge>{student?.group}</Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Contact Information
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{student?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;

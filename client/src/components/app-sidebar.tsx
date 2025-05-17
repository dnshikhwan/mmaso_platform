import mmaso from "../assets/mmaso.png";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { IStudent } from "@/interfaces/student.interface";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [userData, setUserData] = useState<IStudent | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const data = {
        user: {
            name: userData?.name,
            email: userData?.email,
            group: userData?.group,
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            {
                title: "Overview",
                url: "#",
                items: [
                    {
                        title: "Profile",
                        url: "/dashboard/profile",
                    },
                ],
            },
            {
                title: "Academic Resources",
                url: "#",
                items: [
                    {
                        title: "Timetable",
                        url: "/dashboard/timetable",
                    },

                    {
                        title: "Study Materials",
                        url: "/dashboard/notes",
                    },
                ],
            },
            {
                title: "Communication",
                url: "#",
                items: [
                    {
                        title: "Announcements",
                        url: "/dashboard/view-announcements",
                    },
                    {
                        title: "Events",
                        url: "/dashboard/view-events",
                    },
                ],
            },
        ],
    };
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                    <img src={mmaso} alt="mmaso" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">MMASO</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={item.url}>
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

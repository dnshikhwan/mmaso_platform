import express, { NextFunction, Request, Response, Router } from "express";
import axios, { AxiosError, AxiosResponse } from "axios";
import crypto from "crypto";
import { sendResponse } from "../helpers/response.helper";
import { APP_MESSAGE, HTTP_RESPONSE_CODE } from "../constants";

// Type definitions
interface Lesson {
    subject: string;
    startTime: string;
    endTime: string;
    teacher: string;
    lessonType: string;
    room: string;
}

interface DaySchedule {
    date: string;
    lessons: Lesson[];
}

interface Week {
    start: string;
    days: Record<string, DaySchedule>;
}

interface TimeTableByWeek {
    group: {
        name: string;
    };
    timetableByWeek: Record<string, Week>;
}

interface UpcomingWeekData {
    group: {
        name: string;
    };
    upcomingWeek: Week;
}

interface ErrorDetails {
    message: string;
    status?: number;
    statusText?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorDetails;
}

// MAI API data structures
interface SubjectData {
    time_start?: string;
    time_end?: string;
    lector?: Record<string, string | number>;
    type?: Record<string, unknown>;
    room?: Record<string, string>;
}

interface DayData {
    pairs?: Record<string, Record<string, SubjectData>>;
}

type ScheduleData = Record<string, DayData>;

interface GroupData {
    name: string;
}

/**
 * Direct API proxy to get timetable from MAI API
 */
export const getTimetable = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { groupCode } = req.params;

        if (!groupCode) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Group code is required",
                },
            });
        }

        console.log(`Fetching timetable for group: ${groupCode}`);

        // Create MD5 hash of the group name
        const groupHash = crypto
            .createHash("md5")
            .update(groupCode)
            .digest("hex");

        // Use the data endpoint from the GitHub project
        const url = `https://public.mai.ru/schedule/data/${groupHash}.json`;

        console.log(`Requesting data from: ${url}`);

        // Fetch data from the API
        const response = await axios.get<ScheduleData>(url, {
            headers: {
                "User-Agent": "",
            },
        });

        // Process the data with week-based organization
        const processedData = repackGroupDataByWeek(response.data, groupCode);

        // Return the processed data
        sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
            processedData,
        });
        return;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching timetable:", axiosError.message);

        // Add more detailed error information
        const errorDetails: ErrorDetails = {
            message: axiosError.message,
        };

        if (axiosError.response) {
            errorDetails.status = axiosError.response.status;
            errorDetails.statusText = axiosError.response.statusText;

            // If the error is 404, the group might not exist
            if (axiosError.response.status === 404) {
                errorDetails.message = `No schedule found for group "${req.params.groupCode}". The group may not exist or may not have a schedule.`;
            }
        }

        return res.status(axiosError.response?.status || 500).json({
            success: false,
            error: errorDetails,
        });
    }
};

/**
 * Endpoint to get the upcoming week's timetable
 */
export const getUpcomingWeekTimetable = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { groupCode } = req.params;

        if (!groupCode) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Group code is required",
                },
            });
        }

        console.log(`Fetching upcoming week for group: ${groupCode}`);

        // Create MD5 hash of the group name
        const groupHash = crypto
            .createHash("md5")
            .update(groupCode)
            .digest("hex");

        // Use the data endpoint from the GitHub project
        const url = `https://public.mai.ru/schedule/data/${groupHash}.json`;

        // Fetch data from the API
        const response = await axios.get<ScheduleData>(url, {
            headers: {
                "User-Agent": "",
            },
        });

        // Get current date
        const today = new Date();

        // Process the data to find the upcoming week
        const upcomingWeekData = getUpcomingWeek(
            response.data,
            groupCode,
            today
        );

        // Return the processed data
        sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
            upcomingWeekData,
        });
        return;
    } catch (error) {
        next(error);
        return;
    }
};

/**
 * Get list of all groups
 */
export const getAllGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Fetch the groups list from the API
        const url = "https://public.mai.ru/schedule/data/groups.json";

        console.log(`Fetching groups from: ${url}`);

        const response = await axios.get<GroupData[]>(url, {
            headers: {
                "User-Agent": "",
            },
        });

        // Process the groups data
        const groups = response.data
            .filter((group) => group.name)
            .map((group) => group.name);

        sendResponse(res, true, HTTP_RESPONSE_CODE.OK, APP_MESSAGE.success, {
            groups,
        });
        return;
    } catch (error) {
        next(error);
        return;
    }
};

/**
 * Get upcoming week's timetable
 */
function getUpcomingWeek(
    data: ScheduleData,
    groupCode: string,
    currentDate: Date
): UpcomingWeekData {
    // Create the resulting object
    const result: UpcomingWeekData = {
        group: { name: groupCode },
        upcomingWeek: {
            start: "",
            days: {},
        },
    };

    // Remove 'group' key if present
    if ("group" in data) {
        const { group, ...rest } = data;
        data = rest as ScheduleData;
    }

    // Get current date info
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed in JS
    const currentYear = currentDate.getFullYear();

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const currentDayOfWeek = currentDate.getDay();

    // Calculate the date of the current week's Monday
    let nextMonday = new Date(currentDate);
    // If today is Sunday (0), we go back 6 days to get to Monday
    // If today is Monday (1), we go back 0 days, etc.
    const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    nextMonday.setDate(currentDate.getDate() - daysFromMonday);

    // Format next Monday as "DD.MM.YYYY"
    const nextMondayStr = `${nextMonday
        .getDate()
        .toString()
        .padStart(2, "0")}.${(nextMonday.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${nextMonday.getFullYear()}`;

    // Set the start date of the upcoming week
    result.upcomingWeek.start = nextMondayStr;

    // Map of day indices to names
    const weekdayMap: Record<number, string> = {
        0: "Воскресенье",
        1: "Понедельник",
        2: "Вторник",
        3: "Среда",
        4: "Четверг",
        5: "Пятница",
        6: "Суббота",
    };

    // Calculate dates for each day of the upcoming week
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(nextMonday);
        dayDate.setDate(nextMonday.getDate() + i);

        const dayOfWeek = dayDate.getDay();
        const dayName = weekdayMap[dayOfWeek];

        // Format date as "DD.MM.YYYY"
        const dateStr = `${dayDate.getDate().toString().padStart(2, "0")}.${(
            dayDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}.${dayDate.getFullYear()}`;

        // Initialize day in the week
        result.upcomingWeek.days[dayName] = {
            date: dateStr,
            lessons: [],
        };

        // Get day data if it exists
        const dayData = data[dateStr];

        // Track unique lessons to avoid duplicates
        const uniqueLessonKeys = new Set<string>();

        // Process pairs for this day
        if (dayData && dayData.pairs) {
            for (const [timeStart, subjects] of Object.entries(dayData.pairs)) {
                for (const [subjectName, subjectData] of Object.entries(
                    subjects
                )) {
                    // Extract values
                    const timeStartClean = subjectData.time_start
                        ? subjectData.time_start.substring(0, 5)
                        : timeStart.substring(0, 5);
                    const timeEndClean = subjectData.time_end
                        ? subjectData.time_end.substring(0, 5)
                        : "";

                    // Extract lecturer
                    let lecturer = "";
                    if (
                        subjectData.lector &&
                        typeof subjectData.lector === "object"
                    ) {
                        const lectorValues = Object.values(subjectData.lector);
                        if (lectorValues.length > 0) {
                            lecturer = lectorValues[0]
                                .toString()
                                .split(" ")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                )
                                .join(" ");
                        }
                    }

                    // Extract type
                    let type = "";
                    if (
                        subjectData.type &&
                        typeof subjectData.type === "object"
                    ) {
                        const typeKeys = Object.keys(subjectData.type);
                        if (typeKeys.length > 0) {
                            type = typeKeys[0];
                        }
                    }

                    // Extract room
                    let room = "";
                    if (
                        subjectData.room &&
                        typeof subjectData.room === "object"
                    ) {
                        const roomValues = Object.values(subjectData.room);
                        if (roomValues.length > 0) {
                            room = roomValues[0];
                        }
                    }

                    // Create a unique key for this lesson to detect duplicates
                    const lessonKey = `${timeStartClean}|${timeEndClean}|${subjectName}|${type}|${room}|${lecturer}`;

                    // Only add if not already present
                    if (!uniqueLessonKeys.has(lessonKey)) {
                        uniqueLessonKeys.add(lessonKey);

                        // Add lesson to the day
                        result.upcomingWeek.days[dayName].lessons.push({
                            subject: subjectName,
                            startTime: timeStartClean,
                            endTime: timeEndClean,
                            teacher: lecturer,
                            lessonType: type,
                            room: room,
                        });
                    }
                }
            }

            // Sort lessons by start time in 24-hour format (ascending)
            result.upcomingWeek.days[dayName].lessons.sort((a, b) => {
                // Parse times to ensure proper 24-hour sorting
                const timeA = a.startTime.split(":").map(Number);
                const timeB = b.startTime.split(":").map(Number);

                // Compare hours first
                if (timeA[0] !== timeB[0]) {
                    return timeA[0] - timeB[0];
                }

                // If hours are equal, compare minutes
                return timeA[1] - timeB[1];
            });
        }
    }

    return result;
}

/**
 * Repack group data by week
 */
function repackGroupDataByWeek(
    data: ScheduleData,
    groupCode: string
): TimeTableByWeek {
    // Create the resulting object
    const result: TimeTableByWeek = {
        group: { name: groupCode },
        timetableByWeek: {},
    };

    // Remove 'group' key if present
    if ("group" in data) {
        const { group, ...rest } = data;
        data = rest as ScheduleData;
    }

    // Collect all dates and sort them
    const allDates = Object.keys(data)
        .filter((key) => key.match(/\d{2}\.\d{2}\.\d{4}/))
        .sort((a, b) => {
            // Sort by date (dd.mm.yyyy format)
            const [dayA, monthA, yearA] = a.split(".").map(Number);
            const [dayB, monthB, yearB] = b.split(".").map(Number);

            // Compare by year, then month, then day
            if (yearA !== yearB) return yearA - yearB;
            if (monthA !== monthB) return monthA - monthB;
            return dayA - dayB;
        });

    if (allDates.length === 0) {
        return result; // No dates found
    }

    // Map of day indices to names
    const weekdayMap: Record<number, string> = {
        0: "Воскресенье",
        1: "Понедельник",
        2: "Вторник",
        3: "Среда",
        4: "Четверг",
        5: "Пятница",
        6: "Суббота",
    };

    // Determine weeks based on dates
    let currentWeekStart: string | null = null;
    let currentWeekNumber = 1;

    allDates.forEach((dateStr) => {
        // Parse the date
        const [day, month, year] = dateStr.split(".").map(Number);
        const jsDate = new Date(year, month - 1, day); // Month is 0-indexed in JS

        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = jsDate.getDay();

        // Determine week start (Monday of the week)
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(jsDate);
        weekStart.setDate(jsDate.getDate() - daysFromMonday);

        // Format week start as "DD.MM.YYYY"
        const weekStartStr = `${weekStart
            .getDate()
            .toString()
            .padStart(2, "0")}.${(weekStart.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${weekStart.getFullYear()}`;

        // Check if this is a new week
        if (currentWeekStart !== weekStartStr) {
            currentWeekStart = weekStartStr;

            // Create a new week entry
            result.timetableByWeek[`Неделя ${currentWeekNumber}`] = {
                start: weekStartStr,
                days: {},
            };

            currentWeekNumber++;
        }

        // Get the current week
        const currentWeek =
            result.timetableByWeek[`Неделя ${currentWeekNumber - 1}`];

        // Get day name
        const dayName = weekdayMap[dayOfWeek];

        // Initialize day in the week if not exists
        if (!currentWeek.days[dayName]) {
            currentWeek.days[dayName] = {
                date: dateStr,
                lessons: [],
            };
        }

        // Get day data
        const dayData = data[dateStr];

        // Track unique lessons to avoid duplicates
        const uniqueLessonKeys = new Set<string>();

        // Process pairs for this day
        if (dayData && dayData.pairs) {
            for (const [timeStart, subjects] of Object.entries(dayData.pairs)) {
                for (const [subjectName, subjectData] of Object.entries(
                    subjects
                )) {
                    // Extract values
                    const timeStartClean = subjectData.time_start
                        ? subjectData.time_start.substring(0, 5)
                        : timeStart.substring(0, 5);
                    const timeEndClean = subjectData.time_end
                        ? subjectData.time_end.substring(0, 5)
                        : "";

                    // Extract lecturer
                    let lecturer = "";
                    if (
                        subjectData.lector &&
                        typeof subjectData.lector === "object"
                    ) {
                        const lectorValues = Object.values(subjectData.lector);
                        if (lectorValues.length > 0) {
                            lecturer = lectorValues[0]
                                .toString()
                                .split(" ")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                )
                                .join(" ");
                        }
                    }

                    // Extract type
                    let type = "";
                    if (
                        subjectData.type &&
                        typeof subjectData.type === "object"
                    ) {
                        const typeKeys = Object.keys(subjectData.type);
                        if (typeKeys.length > 0) {
                            type = typeKeys[0];
                        }
                    }

                    // Extract room
                    let room = "";
                    if (
                        subjectData.room &&
                        typeof subjectData.room === "object"
                    ) {
                        const roomValues = Object.values(subjectData.room);
                        if (roomValues.length > 0) {
                            room = roomValues[0];
                        }
                    }

                    // Create a unique key for this lesson to detect duplicates
                    const lessonKey = `${timeStartClean}|${timeEndClean}|${subjectName}|${type}|${room}|${lecturer}`;

                    // Only add if not already present
                    if (!uniqueLessonKeys.has(lessonKey)) {
                        uniqueLessonKeys.add(lessonKey);

                        // Add lesson to the day
                        currentWeek.days[dayName].lessons.push({
                            subject: subjectName,
                            startTime: timeStartClean,
                            endTime: timeEndClean,
                            teacher: lecturer,
                            lessonType: type,
                            room: room,
                        });
                    }
                }
            }

            // Sort lessons by start time
            currentWeek.days[dayName].lessons.sort((a, b) => {
                return a.startTime.localeCompare(b.startTime);
            });
        }
    });

    return result;
}

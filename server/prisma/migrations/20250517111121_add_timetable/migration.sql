-- CreateTable
CREATE TABLE "Timetable" (
    "id" SERIAL NOT NULL,
    "groupCode" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "teacher" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Timetable_groupCode_idx" ON "Timetable"("groupCode");

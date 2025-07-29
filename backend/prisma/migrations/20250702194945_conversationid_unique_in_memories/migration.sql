/*
  Warnings:

  - A unique constraint covering the columns `[conversationId]` on the table `memories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "memories_conversationId_key" ON "memories"("conversationId");

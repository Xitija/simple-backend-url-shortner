-- CreateTable
CREATE TABLE "UrlSchema" (
    "urlId" VARCHAR(255) NOT NULL,
    "origUrl" VARCHAR(255) NOT NULL,
    "shortUrl" VARCHAR(255) NOT NULL,
    "clicks" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlSchema_pkey" PRIMARY KEY ("urlId")
);

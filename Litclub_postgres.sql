CREATE TABLE "MEMBER" (
	"user_id" integer(8) NOT NULL,
	"email" serial(20) NOT NULL,
	"username" varchar(20) NOT NULL UNIQUE,
	"password" varchar(20) NOT NULL,
	"name" varchar(20) NOT NULL,
	"surname" varchar(20) NOT NULL,
	"birthdate" DATE NOT NULL,
	"profession" varchar(20) NOT NULL,
	"profile_photo" varchar(20) NOT NULL,
	"isadmin" BOOLEAN NOT NULL,
	"city" varchar(20) NOT NULL,
	"quote" varchar(20) NOT NULL,
	"member_follows" integer(8) NOT NULL,
	CONSTRAINT "MEMBER_pk" PRIMARY KEY ("user_id","email")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "ADMIN" (
	"user_id" integer(8) NOT NULL,
	"email" serial(20) NOT NULL,
	"username" varchar(20) NOT NULL UNIQUE,
	"password" varchar(20) NOT NULL,
	"name" varchar(20) NOT NULL,
	"surname" varchar(20) NOT NULL,
	"birthdate" DATE NOT NULL,
	"profession" varchar(20) NOT NULL,
	"profile_photo" varchar(20) NOT NULL,
	"isadmin" BOOLEAN NOT NULL,
	"city" varchar(20) NOT NULL,
	"quote" varchar(20) NOT NULL,
	CONSTRAINT "ADMIN_pk" PRIMARY KEY ("user_id","email")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TOPIC" (
	"topic_id" integer(8) NOT NULL,
	"title" varchar(255) NOT NULL,
	"photo" varchar(20) NOT NULL,
	"description" TEXT NOT NULL,
	"book_id" integer(8) NOT NULL,
	"createdby_mem" integer(8) NOT NULL,
	"createdby_adm" integer(8) NOT NULL,
	"canbedeletedby_mem" integer(8) NOT NULL,
	"canbedeletedby_adm" integer(8) NOT NULL,
	"timestamp" DATETIME NOT NULL,
	CONSTRAINT "TOPIC_pk" PRIMARY KEY ("topic_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "BOOK" (
	"book_id" serial(8) NOT NULL,
	"title" varchar(20) NOT NULL,
	"author" varchar(20) NOT NULL,
	"release_date" DATE,
	"translator" varchar(20),
	CONSTRAINT "BOOK_pk" PRIMARY KEY ("book_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "BANS" (
	"timestamp" DATETIME NOT NULL,
	"member_id" integer(8) NOT NULL,
	"admin_id" integer(8) NOT NULL,
	CONSTRAINT "BANS_pk" PRIMARY KEY ("member_id","admin_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "FOLLOWS_TOPIC" (
	"timestamp" DATETIME NOT NULL,
	"member_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	CONSTRAINT "FOLLOWS_TOPIC_pk" PRIMARY KEY ("member_id","topic_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "COMMENTS_U" (
	"timestamp" DATETIME NOT NULL,
	"topic_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "COMMENTS_U_pk" PRIMARY KEY ("topic_id","member_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "RATES" (
	"timestamp" DATETIME NOT NULL,
	"topic_id" integer(8) NOT NULL,
	"member_id" integer(8) NOT NULL,
	CONSTRAINT "RATES_pk" PRIMARY KEY ("topic_id","member_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "FOLLOWS_MEMBER" (
	"timestamp" DATETIME NOT NULL,
	"memberfollows_id" integer(8) NOT NULL,
	"member_id" integer(8) NOT NULL,
	CONSTRAINT "FOLLOWS_MEMBER_pk" PRIMARY KEY ("memberfollows_id","member_id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "MEMBER" ADD CONSTRAINT "MEMBER_fk0" FOREIGN KEY ("member_follows") REFERENCES ""("");


ALTER TABLE "TOPIC" ADD CONSTRAINT "TOPIC_fk0" FOREIGN KEY ("book_id") REFERENCES "BOOK"("book_id");
ALTER TABLE "TOPIC" ADD CONSTRAINT "TOPIC_fk1" FOREIGN KEY ("createdby_mem") REFERENCES "MEMBER"("user_id");
ALTER TABLE "TOPIC" ADD CONSTRAINT "TOPIC_fk2" FOREIGN KEY ("createdby_adm") REFERENCES "ADMIN"("user_id");
ALTER TABLE "TOPIC" ADD CONSTRAINT "TOPIC_fk3" FOREIGN KEY ("canbedeletedby_mem") REFERENCES "MEMBER"("user_id");
ALTER TABLE "TOPIC" ADD CONSTRAINT "TOPIC_fk4" FOREIGN KEY ("canbedeletedby_adm") REFERENCES "ADMIN"("user_id");


ALTER TABLE "BANS" ADD CONSTRAINT "BANS_fk0" FOREIGN KEY ("member_id") REFERENCES "MEMBER"("user_id");
ALTER TABLE "BANS" ADD CONSTRAINT "BANS_fk1" FOREIGN KEY ("admin_id") REFERENCES "ADMIN"("user_id");

ALTER TABLE "FOLLOWS_TOPIC" ADD CONSTRAINT "FOLLOWS_TOPIC_fk0" FOREIGN KEY ("member_id") REFERENCES "MEMBER"("user_id");
ALTER TABLE "FOLLOWS_TOPIC" ADD CONSTRAINT "FOLLOWS_TOPIC_fk1" FOREIGN KEY ("topic_id") REFERENCES "TOPIC"("topic_id");

ALTER TABLE "COMMENTS_U" ADD CONSTRAINT "COMMENTS_U_fk0" FOREIGN KEY ("topic_id") REFERENCES "TOPIC"("topic_id");
ALTER TABLE "COMMENTS_U" ADD CONSTRAINT "COMMENTS_U_fk1" FOREIGN KEY ("member_id") REFERENCES "MEMBER"("user_id");

ALTER TABLE "RATES" ADD CONSTRAINT "RATES_fk0" FOREIGN KEY ("topic_id") REFERENCES "TOPIC"("topic_id");
ALTER TABLE "RATES" ADD CONSTRAINT "RATES_fk1" FOREIGN KEY ("member_id") REFERENCES "MEMBER"("user_id");

ALTER TABLE "FOLLOWS_MEMBER" ADD CONSTRAINT "FOLLOWS_MEMBER_fk0" FOREIGN KEY ("memberfollows_id") REFERENCES "MEMBER"("member_follows");
ALTER TABLE "FOLLOWS_MEMBER" ADD CONSTRAINT "FOLLOWS_MEMBER_fk1" FOREIGN KEY ("member_id") REFERENCES "MEMBER"("user_id");

